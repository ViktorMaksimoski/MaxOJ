import express from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { codeViewLimit } from '../middlewares/codeViewLimit.js'

const router = express.Router()

const s3 = new S3Client({
    endpoint: process.env.B2_ENDPOINT,
    region: "eu-central-003",
    credentials: {
        accessKeyId: process.env.B2_KEY_ID,
        secretAccessKey: process.env.B2_APPLICATION_KEY
    }
})

export const getCode = async (key) => {
    const command = new GetObjectCommand({
        Bucket: process.env.B2_BUCKET_NAME,
        Key: `codes/${key}.cpp`
    })

    const res = await s3.send(command);

    return await res.Body.transformToString();
}

router.get('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    const { success, reset } = await codeViewLimit.limit(req.user.uid);

    if(!success) {
        return res.status(429).json({
            success: false,
            message: "Лимитот прегледи на код е достигнат. Ве молиме почекајте",
            reset,
        })
    }

    const code = await getCode(id);

    res.json({
        success: true,
        code: code
    })
})

export default router;