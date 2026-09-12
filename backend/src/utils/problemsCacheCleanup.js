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

        const checkerKey = `checker-cache:${pid}`
        const checkerExists = await upstash.exists(checkerKey);

        if(!exists) {
            console.log(`Deleting checker for ${pid}`);

            await fs.rm(path.join(CACHE_DIR, "checkers", pid), {
                recursive: true,
                force: true
            })
        }
    }
}