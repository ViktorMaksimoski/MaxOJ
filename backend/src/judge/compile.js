import path from "path";
import { runDocker } from '../docker.js'

export const compiler = async (dir) => {
    const res = await runDocker([
        "run",
        "--rm",
        "--network",
        "none",
        "--memory",
        "512m",
        "--cpus",
        "1",
        "--pids-limit",
        "64",

        "-v",
        `${dir}:/judge`,

        "maxoj-cpp",

        "g++",
        "-std=c++17",
        "-O2",

        "/judge/main.cpp",
        "-o",
        "/judge/main"
    ])

    return res;
}