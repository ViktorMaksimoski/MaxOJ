import fs from 'fs/promises'
import path from 'path'
import { upstash } from '../config/upstash.js';

const CACHE_DIR = path.join(process.cwd(), "cache", "tests");

export const cacheCleanup = async () => {
    let problems;

    try {
        problems = await fs.readdir(CACHE_DIR)
    } catch {
        return ;
    }

    for(const pid of problems) {
        const key = `test-cache:${pid}`
        const exists = await upstash.exists(key);

        if(!exists) {
            console.log(`Deleting tests for ${pid}`)

            await fs.rm(path.join(CACHE_DIR, pid), {
                recursive: true,
                force: true
            })
        }
    }
}