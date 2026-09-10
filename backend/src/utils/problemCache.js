import fs from 'fs/promises'
import path from 'path'
import { upstash } from '../config/upstash.js'
import { getProblem } from './getProblem.js'

const CACHE_DIR = path.join(process.cwd(), "cache", "problems")

export const getCachePath = (pid) => {
    return path.join(CACHE_DIR, `${pid}.json`);
}

export const isCached = async (pid) => {
    const path = getCachePath(pid);

    try {
        await fs.access(path);
        return true;
    } catch {
        return false;
    }
}

export const cacheProblem = async (pid) => {
    const cached = await isCached(pid);

    if(cached) {
        console.log(`Using cached metadata for problem ${pid}`);
        await upstash.expire(`problem-cache:${pid}`, 15 * 60);
        return JSON.parse(await fs.readFile(getCachePath(pid), "utf8"));
    }

    const res = await getProblem(pid);
    // await upstash.set(`problem-cache:${pid}`, "1", { ex: 15 * 60 });
    // console.log('gets here', res);
    const baba = JSON.parse(res);
    // console.log('skoro gotovo')
    return baba;
}