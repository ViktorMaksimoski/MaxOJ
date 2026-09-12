import { s3 } from "../config/s3.js"
import { GetObjectCommand } from "@aws-sdk/client-s3"

export const getChecker = async (key) => {
    const command = new GetObjectCommand({
        Bucket: process.env.B2_BUCKET_NAME,
        Key: `checkers/${key}`
    })

    const res = await s3.send(command);
    return await res.Body.transformToString();
}