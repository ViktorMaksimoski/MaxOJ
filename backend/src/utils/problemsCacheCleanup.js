import fs from 'fs/promises'
import path from 'path'
import { upstash } from '../config/upstash.js';

const CACHE_DIR = path.join(process.cwd(), "cache");

export const problemsCacheCleanup = async () => {
    let problems;

    try {
        problems = await fs.readdir(path.join(CACHE_DIR, "tests"))
    } catch {
        return ;
    }

    for(const pid of problems) {
        const key = `test-cache:${pid}`
        const exists = await upstash.exists(key);

        if(!exists) {
            console.log(`Deleting tests for ${pid}`)

            await fs.rm(path.join(CACHE_DIR, "tests", pid), {
                recursive: true,
                force: true
            })
        }

        const pkey = `problem-cache:${pid}`
        const pexists = await upstash.exists(pkey);

        if(!pexists) {
            console.log(`Deleting metadata for ${pid}`)

            await fs.rm(path.join(CACHE_DIR, "problems", pid), {
                recursive: true,
                force: true
            })
        }
    }
}