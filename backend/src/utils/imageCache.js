import fs from 'fs/promises'
import fsNormal from 'fs'
import path from 'path'
import { upstash } from '../config/upstash.js'
import { getImage } from './getImage.js';
import { pipeline } from 'stream/promises';

const CACHE_DIR = path.join(process.cwd(), "cache", "images");

export const getCachePath = (key) => {
    return path.join(CACHE_DIR, `${key}.txt`)
}

export const isCached = async (key) => {
    const path = getCachePath(key);

    try {
        await fs.access(path);
        return true;
    } catch {
        return false;
    }
}

export const cacheImage = async (key) => {
    const cached = await isCached(key);

    if(cached) {
        return await fs.readFile(getCachePath(key), "utf8");
    }

    const res = await getImage(key);

    await upstash.set(`image-cache:${key}`, "1", { ex: 15 * 60 });

    const [pid, name] = key.split("/");

    const file = getCachePath(key);

    await fs.mkdir(path.join(CACHE_DIR, pid), {
        recursive: true
    });

    await fs.writeFile(file, res);

    return res;
}