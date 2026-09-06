import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"

const redis = Redis.fromEnv()

export const codeViewLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(2, "60 s"),
    prefix: "MaxOJ:codeViewLimit",
})