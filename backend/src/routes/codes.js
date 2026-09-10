import express from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { codeViewLimit } from '../middlewares/codeViewLimit.js'
import { s3 } from '../config/s3.js'

const router = express.Router()

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