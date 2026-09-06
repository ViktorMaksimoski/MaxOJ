import { Queue } from "bullmq"
import { redis } from "../config/redis.js"

export const judgeQueue = new Queue("judge", {
    connection: redis,
})