import express from "express"
import { authMiddleware } from "../middlewares/auth.js"
import { judgeQueue } from "../queues/judgeQueue.js"
import { submissionLimit } from "../middlewares/submissionLimit.js"
import { db } from "../config/firebase.js"
import { S3Client, PutObjectCommand, S3, RestoreObject$ } from "@aws-sdk/client-s3"
import { submissionsGetLimit } from "../middlewares/submissionsGetLimit.js"
import { singleSubmissionLimit } from "../middlewares/singleSubmissionLimit.js"
import { flattenNestedArrayItems } from "ioredis/built/replyTransformers.js"
import { s3 } from "../config/s3.js"

const router = express.Router()

router.get('/single/:pid', authMiddleware, async(req, res) => {
    try {
        const { pid } = req.params;

        const { success, reset } = await singleSubmissionLimit.limit(req.user.uid)

        if(!success) {
            return res.status(429).json({
                success: false,
                message: "Го надминавте лимитот за прегледување решение. Обидете се подоцно."
            })
        }

        res.json({
            success: true
        })

    } catch(err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: "Системска грешка. Решението не може да се превземе."
        })
    }
})

router.get("/:pid", authMiddleware, async(req, res) => {
    try {
        const { pid } = req.params;
        const { nxt } = req.query;
        console.log(req.user.uid, pid)

        const { success, reset } = await submissionsGetLimit.limit(req.user.uid);

        if(!success) {
            return res.status(429).json({
                success: false,
                message: "Го надминавте лимитот за прегледување решенија. Обидете се подоцно."
            })
        }

        let query = await db.collection("submissions")
        .where("pid", "==", pid)
        .where("user", "==", req.user.uid)
        .orderBy("createdAt", "desc")
        .select("points", "createdAt")
        .limit(5)

        if(nxt) {
            const doc = db.collection("submissions")
            .doc(nxt).get();

            if(!doc.exists) {
                res.status(400).json({
                    success: false,
                    message: "Невалиден почеток"
                })
            }

            query = query.startAfter(doc);
        }

        const snap = await query.get();

        const data = snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

        res.json({
            success: true,
            data: data,
            reset: reset,
            nextStop: snap.docs.length > 0 ?
            snap.docs[snap.docs.length-1] : null,
            prevStop: nxt
        })

    } catch(err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: "Системска грешка. Решенијата не може да се превземат."
        })
    }
})

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { pid, code } = req.body;

        if(!pid || !code) {
            return res.status(400).json({
                success: false,
                message: "Мора да испратите код",
            })
        }

        if(code.length > 6000) {
            return res.status(400).json({
                success: false,
                message: "Вашиот код не смее да има повеќе од 6000 карактери"
            })
        }

        const forbiddenPatterns = [
            /#\s*pragma/i,
            /system\s*\(/i,
            /fork\s*\(/i,
            /exec\s*\(/i,
            /popen\s*\(/i,
            /fstream\s*\(/i,
        ];

        for(const pattern of forbiddenPatterns) {
            if(pattern.test(code)) {
                return res.status(400).json({
                    success: false,
                    message: `Вашиот код не смее да користи ${pattern}`
                })
            }
        }

        const user = req.user.uid;
        const key = `${user.uid}`;

        const { success, reset } = await submissionLimit.limit(key);

        if(!success) {
            return res.status(429).json({
                success: false,
                message: "Лимитот на испраќања е достигнат. Ве молиме почекајте",
                reset,
            })
        }

        const submission = await db.collection("submissions").add({
            pid,
            user,
            status: "QUEUED",
            points: 0,
            timeUsed: 0,
            memoryUsed: 0,
            subtasks: [],
            createdAt: new Date()
        })

        await s3.send(new PutObjectCommand({
            Bucket: process.env.B2_BUCKET_NAME,
            Key: `codes/${submission.id}.cpp`,
            Body: code
        }))

        const job = await judgeQueue.add("judge", {
            submissionId: submission.id,
            pid,
            user,
            code,
        })

        res.json({
            success: true,
            message: "Решението се процесира",
            submissionId: submission.id
        })
    } catch(err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Системска грешка. Решението не може да се испрати",
        })
    }
})

export default router