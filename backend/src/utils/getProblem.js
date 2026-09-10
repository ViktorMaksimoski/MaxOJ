import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'
import { db } from '../config/firebase.js'
// import { getCachePath } from './problemCache.js'

const CACHE_DIR = path.join(process.cwd(), "cache", "problems")

const getProblemFirebase = async (pid) => {
    console.log(`Downloading metadata for ${pid}`);

    const doc = await db.collection("problems").doc(pid).get();

    if(!doc.exists) {
        return {
            exists: false
        }
    }

    return {
        exists: true,
        ...doc.data()
    }
}

export const getProblem = async (pid) => {
    const file = path.join(CACHE_DIR, `${pid}.json`);

    await fsPromises.mkdir(CACHE_DIR, {
        recursive: true
    })

    const data = await getProblemFirebase(pid);

    await fsPromises.writeFile(file, JSON.stringify(data, null, 2), "utf8");
    return await fsPromises.readFile(file, "utf8");
}