import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"

const redis = Redis.fromEnv()

export const submissionLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "60 s"),
    prefix: "MaxOJ:submissionLimit",
})