import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import readlineSync from "readline-sync";
import { db } from "./src/config/firebase.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


// ==================================================
// Helpers
// ==================================================

const s3 = new S3Client({
    endpoint: process.env.B2_ENDPOINT,
    region: "eu-central-003",
    credentials: {
        accessKeyId: process.env.B2_KEY_ID,
        secretAccessKey: process.env.B2_APPLICATION_KEY
    }
})

function askString(question) {
    while (true) {
        const value = readlineSync.question(question).trim();

        if (value.length > 0) {
            return value;
        }

        console.log("This field cannot be empty.");
    }
}


function askInt(question, min = 0) {
    while (true) {
        const value = readlineSync.questionInt(question);

        if (value >= min) {
            return value;
        }

        console.log(`Please enter a number >= ${min}.`);
    }
}


// ==================================================
// Paths
// ==================================================

const backendDir = process.cwd();

const generatorDir = path.join(
    backendDir,
    "generator"
);

const testsDir = path.join(
    generatorDir,
    "tests"
);

const solutionPath = path.join(
    generatorDir,
    "sol"
);


// ==================================================
// Check files/directories
// ==================================================

if (!fs.existsSync(testsDir)) {
    console.error(`\nTests directory does not exist:`);
    console.error(testsDir);
    process.exit(1);
}

if (!fs.existsSync(solutionPath)) {
    console.error(`\nReference solution does not exist:`);
    console.error(solutionPath);

    console.error("\nCompile it first, for example:");
    console.error("g++ generator/sol.cpp -O2 -o generator/sol");

    process.exit(1);
}


// ==================================================
// Problem metadata
// ==================================================

console.log("\n================================");
console.log("        ADD NEW PROBLEM");
console.log("================================\n");

const name = askString("Problem name: ");
const problemId = askString("Problem ID: ");

const timeLimit = askInt(
    "Time limit (ms): ",
    1
);

const memoryLimit = askInt(
    "Memory limit (MB): ",
    1
);


// ==================================================
// Find tests
// ==================================================

const files = fs.readdirSync(testsDir);

const inputTests = files
    .filter(file => /^\d+\.in$/.test(file))
    .map(file => Number(file.replace(".in", "")))
    .sort((a, b) => a - b);

if (inputTests.length === 0) {
    console.error("\nNo .in files found.");

    console.error(
        `\nExpected files like:\n` +
        `${testsDir}/1.in\n` +
        `${testsDir}/2.in\n` +
        `${testsDir}/3.in`
    );

    process.exit(1);
}

console.log(`\nFound ${inputTests.length} input tests.`);


// ==================================================
// Check for duplicate / missing test numbers
// ==================================================

for (let i = 0; i < inputTests.length; i++) {
    const expected = i + 1;

    if (inputTests[i] !== expected) {
        console.error(
            `\nTest numbering must start at 1 and be continuous.`
        );

        console.error(
            `Expected test ${expected}, found ${inputTests[i]}.`
        );

        process.exit(1);
    }
}

console.log(
    `Tests: 1 -> ${inputTests.length}`
);


// ==================================================
// Generate output files
// ==================================================

console.log("\n================================");
console.log("       GENERATING OUTPUTS");
console.log("================================\n");

for (const testNumber of inputTests) {

    const inputPath = path.join(
        testsDir,
        `${testNumber}.in`
    );

    const outputPath = path.join(
        testsDir,
        `${testNumber}.out`
    );

    console.log(`Running test ${testNumber}...`);

    try {

        const input = fs.readFileSync(
            inputPath
        );

        const output = execFileSync(
            solutionPath,
            {
                input,
                maxBuffer: 1024 * 1024 * 100
            }
        );

        fs.writeFileSync(
            outputPath,
            output
        );

    } catch (error) {

        console.error(
            `\nReference solution failed on test ${testNumber}.`
        );

        console.error(error.message);

        process.exit(1);
    }
}

console.log(
    `\nGenerated ${inputTests.length} output files.`
);


// ==================================================
// Subtasks
// ==================================================

console.log("\n================================");
console.log("           SUBTASKS");
console.log("================================");

const subtaskCount = askInt(
    "\nNumber of subtasks: ",
    1
);

const subtasks = [];

for (let i = 1; i <= subtaskCount; i++) {

    console.log(`\n--- Subtask ${i} ---`);

    const points = askInt(
        "Points: ",
        1
    );

    const firstTest = askInt(
        "First test: ",
        1
    );

    const lastTest = askInt(
        "Last test: ",
        firstTest
    );


    // ----------------------------------------------
    // Check test range
    // ----------------------------------------------

    if (lastTest > inputTests.length) {

        console.error(
            `There are only ${inputTests.length} tests.`
        );

        process.exit(1);
    }


    // ----------------------------------------------
    // Generate test IDs
    // ----------------------------------------------

    const tests = [];

    for (
        let test = firstTest;
        test <= lastTest;
        test++
    ) {
        tests.push(String(test));
    }


    subtasks.push({
        id: i,
        points,
        firstTest,
        lastTest,
        tests
    });
}


// ==================================================
// Validate points
// ==================================================

const totalPoints = subtasks.reduce(
    (sum, subtask) =>
        sum + subtask.points,
    0
);

if (totalPoints !== 100) {

    console.error(
        `\nSubtask points must add up to 100.`
    );

    console.error(
        `Current total: ${totalPoints}`
    );

    process.exit(1);
}


// ==================================================
// Display final data
// ==================================================

console.log("\n================================");
console.log("        PROBLEM SUMMARY");
console.log("================================\n");

console.log(`ID:           ${problemId}`);
console.log(`Name:         ${name}`);
console.log(`Time limit:   ${timeLimit} ms`);
console.log(`Memory limit: ${memoryLimit} MB`);
console.log(`Tests:        ${inputTests.length}`);

console.log("\nSubtasks:");

for (const subtask of subtasks) {

    console.log(
        `  Subtask ${subtask.id}: ` +
        `${subtask.points} points ` +
        `(tests ${subtask.firstTest}-${subtask.lastTest})`
    );
}

console.log("\n================================");
console.log("       VALIDATION SUCCESSFUL");
console.log("================================\n");

console.log(
    "The problem is ready to be uploaded to Firebase."
);


try {
    const ref = db.collection("problems").doc(problemId);

    let subtaskPoints = [];
    let subtaskRange = [];

    for (const subtask of subtasks) {
        subtaskPoints.push(subtask.points);
        subtaskRange.push(subtask.lastTest);
    }

    await ref.set({
        problemId,
        name,
        timeLimit,
        memoryLimit,
        subtaskPoints,
        subtaskRange,
    })

    console.log("Problem metadata uploaded to firebase")
} catch(err) {
    console.log("Error uploading problem metadata")
    process.exit(1)
}

// for (const testNumber of inputTests) {
//     console.log(`Uploading test ${testNumber}.in`);
//     await s3.send(new PutObjectCommand({
//         Bucket: process.env.B2_BUCKET_NAME,
//         Key: `${problemId}/${testNumber}.in`,
//         Body: fs.readFileSync(path.join(testsDir, `${testNumber}.in`))
//     }))
//     console.log(`Uploading test ${testNumber}.out`);
//     await s3.send(new PutObjectCommand({
//         Bucket: process.env.B2_BUCKET_NAME,
//         Key: `${problemId}/${testNumber}.out`,
//         Body: fs.readFileSync(path.join(testsDir, `${testNumber}.out`))
//     }))
// }