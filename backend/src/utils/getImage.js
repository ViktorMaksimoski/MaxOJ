import { GetObjectCommand, HeadObjectCommand, S3 } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3 } from '../config/s3.js'

export const getImage = async (key) => {
    try {
        await s3.send(new HeadObjectCommand({
            Bucket: process.env.B2_BUCKET_NAME,
            Key: `images/${key}`
        }))

        const command = new GetObjectCommand({
            Bucket: process.env.B2_BUCKET_NAME,
            Key: `images/${key}`
        });

        return await getSignedUrl(s3, command, {
            expiresIn: 15 * 60
        })
    } catch(err) {
        if(err.name === "NotFound" || err.$metadata?.httpStatusCode == 404)
            return "NotFound"
        throw err;
    }
}