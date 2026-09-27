import fs from 'fs/promises'
import path from 'path'
import { upstash } from '../config/upstash.js';

const CACHE_DIR = path.join(process.cwd(), "cache", "checkers");

export const checkersCacheCleanup = async () => {
    let checkers;

    try {
        checkers = await fs.readdir(CACHE_DIR)
    } catch {
        return ;
    }

    for(const checker of checkers) {
        const key = `checker-cache:${checker}`;
        const exists = await upstash.exists(key);

        if(!exists) {
            console.log(`Deleting checker ${checker}`)

            await fs.rm(path.join(CACHE_DIR, checker), {
                recursive: true,
                force: true
            })
        }
    }
}