import fs from 'fs/promises'
import path from 'path'
import { getAllTests } from './getTest.js'
import { upstash } from '../config/upstash.js'

const CACHE_DIR = path.join(process.cwd(), "cache", "tests")

export const getCachePath = async (pid) => {
    return path.join(CACHE_DIR, pid)
}

export const isCached = async (pid) => {
    const cachePath = await getCachePath(pid)

    try {
        await fs.access(cachePath);
        return true;
    } catch {
        return false;
    }
}

export const cacheTests = async (pid) => {
    const cached = await isCached(pid);

    if(cached) {
        console.log(`Using cached tests for problem ${pid}`)

        await upstash.expire(`test-cache:${pid}`, 15 * 60)

        return getCachePath(pid);
    }

    const res = await getAllTests(pid);
    await upstash.set(`test-cache:${pid}`, "1", { ex: 15 * 60 });
    return res;
}