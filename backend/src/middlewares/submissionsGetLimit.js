import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"

const redis = Redis.fromEnv()

export const submissionsGetLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "60 s"),
    prefix: "MaxOJ:submissionsGetLimit",
})