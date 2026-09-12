import fs from 'fs/promises'
import fsNormal from 'fs'
import path from 'path'
import { upstash } from '../config/upstash.js'
import { getChecker } from './getChecker.js'

const CACHE_DIR = path.join(process.cwd(), "cache", "checkers");

export const getCachePath = (key) => {
    return path.join(CACHE_DIR, key);
}

export const isCached = async (key) => {
    try {
        await fs.access(getCachePath(key));
        return true;
    } catch {
        return false;
    }
}

export const cacheChecker = async (key) => {
    const cached = await isCached(key);

    if(cached) {
        await upstash.expire(`checker-cache:${key}`, 30 * 60)
        return await fs.readFile(getCachePath(key), "utf8");
    }

    const res = await getChecker(key);

    const file = getCachePath(key);

    await fs.writeFile(file, res);

    upstash.set(`checker-cache:${key}`, "1", { ex: 30 * 60 });

    return res;
}