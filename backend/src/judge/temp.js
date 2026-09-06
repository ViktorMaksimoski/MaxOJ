import fs from 'fs/promises';
import os from 'os';
import crypto from 'crypto';
import path from 'path';

export const createSubmissionDir = async () => {
    const id = crypto.randomUUID();

    const dir = path.join(
        os.tmpdir(),
        'maxoj',
        id
    )

    await fs.mkdir(dir, {
        recursive: true
    })

    return dir;
}