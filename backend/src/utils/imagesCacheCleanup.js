import fs from 'fs/promises'
import path from 'path'
import { upstash } from '../config/upstash.js';

const CACHE_DIR = path.join(process.cwd(), "cache", "images");

export const imagesCacheCleanup = async () => {
    let images;

    try {
        images = await fs.readdir(CACHE_DIR);
    } catch {
        return ;
    }

    for(const folder of images) {
        const folderPath = path.join(CACHE_DIR, folder);

        const files = await fs.readdir(folderPath);

        let cnt = files.length

        for(const file of files) {
            const name = file.slice(0, -4);

            const key = `image-cache:${folder}/${name}`

            const exists = await upstash.exists(key);

            if(!exists) {
                console.log(`Deleting image ${key}`);

                await fs.rm(path.join(folderPath, file), {
                    recursive: true,
                    force: true
                })

                cnt--;
            }
        }

        if(cnt == 0) {
            await fs.rm(folderPath, {
                recursive: true, 
                force: true
            })
        }
    }
}