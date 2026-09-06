import fs from "fs/promises"
import path from "path"
import { runDocker } from "../docker.js"

export const run = async (dir, input, timeLimit, memoryLimit) => {
    const inputPath = path.join(dir, "input.txt")
    memoryLimit += 128

    await fs.writeFile(inputPath, input);

    const res = await runDocker([
        "run",
        "--rm",
        "-i",

        "--network",
        "none",

        "--memory",
        `${memoryLimit}m`,

        "--memory-swap",
        `${memoryLimit}m`,

        "--cpus",
        "1",

        "--pids-limit",
        "64",

        "--read-only",

        "--tmpfs",
        "/tmp:rw,noexec,nosuid,size=64m",

        "-v",
        `${dir}:/judge:rw`,

        "maxoj-cpp",

        "/runner/runner",
        `${timeLimit}`,
        "/judge/main"
    ], input)

    return res;
}