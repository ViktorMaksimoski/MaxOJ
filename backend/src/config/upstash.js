import { Redis } from '@upstash/redis'

export const upstash = Redis.fromEnv()