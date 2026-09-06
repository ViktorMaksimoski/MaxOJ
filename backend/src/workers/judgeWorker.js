import { Worker } from "bullmq";
import { redis } from "../config/redis.js";
import { createSubmissionDir } from "../judge/temp.js";
import { compiler } from "../judge/compile.js";
import fs from 'fs/promises';
import path from 'path';
import { db } from "../config/firebase.js";
import { getAllTests, getTest } from "../utils/getTest.js";
import { run } from "../judge/run.js";
import { cacheTests } from "../utils/testCache.js";
import { OutputLocation$ } from "@aws-sdk/client-s3";

const worker = new Worker("judge", async (job) => {
    console.log("Job received: ", job.id)

    const { submissionId, pid, user, code } = job.data; 

    //get problem data
    const problem = await db.collection("problems").doc(pid).get()

    if(!problem.exists) {
        console.log("Problem not found: ", pid)

        await db.collection("submissions").doc(submissionId)
        .update({
            status: "STOPPED"
        })

        return {
            status: "error",
            message: "Problem not found"
        }
    }

    const problemData = problem.data();

    await db.collection("submissions").doc(submissionId)
    .update({
        status: "JUDGING"
    });

    //compile the file
    const dir = await createSubmissionDir();

    await fs.writeFile(path.join(dir, "main.cpp"), code);

    const res = await compiler(dir);

    let flag = "", points = 0;

    if(res.code !== 0) {
        console.log("Compilation failed: ", res.stderr)

        await db.collection("submissions").doc(submissionId)
        .update({
            status: "CE",
            errorMessage: res.stderr,
            finishedAt: new Date()
        })
        
        return {
            status: "finished",
            message: "CE",
            points: 0
        }
    } else {
        console.log("Compilation succeeded")
    }

    await cacheTests(pid);

    let subtaskLen = problemData.subtaskPoints.length;

    let L = 1;
    console.log(`Submission testing ${submissionId}`);

    let subtaskResults = [];
    let maxTime = 0;
    let maxMemory = 0;

    for(let i=0; i<subtaskLen; i++) {
        let R = problemData.subtaskRange[i];

        let score = problemData.subtaskPoints[i];
        let subtaskFlag = 'AC';

        for(let j=L; j<=R; j++) {
            const test = await getTest(`${pid}/${j}.in`)

            const output = await run(dir, test, problemData.timeLimit, problemData.memoryLimit);

            maxMemory = Math.max(maxMemory, output.memory);

            if(output.timedOut) {
                score = 0;
                subtaskFlag = 'TLE';
                maxTime = problemData.timeLimit;
                break;
            }

            maxTime = Math.max(maxTime, output.time);

            if(output.code !== 0) {
                score = 0;
                subtaskFlag = 'RE';
                console.log('Error ', output.stderr)
                break;
            }

            const expected = await getTest(`${pid}/${j}.out`);

            console.log('Expected: ', expected);
            console.log('Output: ', output)

            if(expected.trim() !== output.stdout.trim()) {
                score = 0;
                subtaskFlag = 'WA';
                break;
            }
        }

        if(subtaskFlag == 'AC') {
            subtaskFlag += score
        }

        subtaskResults.push(subtaskFlag)

        console.log(`Subtask ${i+1}: ${score}, ${subtaskFlag}`)
        points += score;

        await db.collection("submissions").doc(submissionId)
        .update({ 
            points: points,
            subtasks: subtaskResults,
            timeUsed: maxTime,
            memoryUsed: maxMemory
        })

        L = R + 1;
    }

    await db.collection("submissions").doc(submissionId)
    .update({
        status: "JUDGED"
    })

    console.log("Points won: ", points)
 
    return {
        status: "finished",
        message: "Compiled",
        points: points,
        subtasks: subtaskResults
    }
}, {
    connection: redis
})

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
})

worker.on("failed", (job, err) => {
    console.error(`Job ${job.id} failed with error: ${err.message}`);
})