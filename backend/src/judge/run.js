import fs from "fs/promises"
import path from "path"
import { runDocker } from "../docker.js"

export const run = async (dir, input, expected, timeLimit, memoryLimit) => {
    const inputPath = path.join(dir, "input.txt")
    const outputPath = path.join(dir, "output.txt")
    const expectedPath = path.join(dir, "expected.txt");

    memoryLimit += 128

    await fs.writeFile(inputPath, input)
    await fs.writeFile(outputPath, "")
    await fs.writeFile(expectedPath, expected)

    const res = await runDocker([
        "run",
        "--rm",

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
        "/judge/output.txt",
        "/judge/checker",
        "/judge/main"
    ])

    return res;
}