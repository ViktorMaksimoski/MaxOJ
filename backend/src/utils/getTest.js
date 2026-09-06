import { S3Client, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { parseObjectValues } from "bullmq";
import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'

const s3 = new S3Client({
    endpoint: process.env.B2_ENDPOINT,
    region: "eu-central-003",
    credentials: {
        accessKeyId: process.env.B2_KEY_ID,
        secretAccessKey: process.env.B2_APPLICATION_KEY
    }
})

const CACHE_DIR = path.join(process.cwd(), "cache", "tests")

export const getTest = async (key) => {
    const file = path.join(CACHE_DIR, key);
    return await fsPromises.readFile(file, "utf8")
}

export const getAllTests = async (pid) => {
    console.log(`Downloading tests for ${pid}`)
    
    const dir = path.join(CACHE_DIR, pid);

    await fsPromises.mkdir(dir, {
        recursive: true
    })

    const command = new ListObjectsV2Command({
        Bucket: process.env.B2_BUCKET_NAME,
        Prefix: `${pid}/`
    })

    const res = await s3.send(command);

    if(!res.Contents) {
        return dir;
    }

    for(const obj of res.Contents) {
        const key = obj.Key;

        const filename = key.slice(`${pid}/`.length)

        if(!filename) continue;

        const filePath = path.join(dir, filename);

        const stream = fs.createWriteStream(filePath);

        const getCommand = new GetObjectCommand({
            Bucket: process.env.B2_BUCKET_NAME,
            Key: key
        })

        const file = await s3.send(getCommand);

        await new Promise((res, rej) => {
            file.Body.pipe(stream);
            file.Body.on("error", rej);
            stream.on("finish", res);
            stream.on("error", rej);
        })
    }

    return dir;
}