import { childSend } from 'bullmq';
import { spawn } from 'child_process';

export const runDocker = (args, input = "", timeLimit = 10000) => {
    return new Promise((res, rej) => {
        const process = spawn('docker', args);

        let stdout = "", stderr = "", timedOut = false


        process.stdout.on('data', (data) => {
            stdout += data.toString()
        })

        process.stderr.on('data', (data) => {
            stderr += data.toString()
        })

        process.on('error', (err) => {
            rej(err)
        })
        

        process.stdin.write(input)
        process.stdin.end()

        process.on('close', (code) => {
            const timeMatch = stderr.match(
                /__TIME__ ([0-9.]+)/
            );

            const exitMatch = stderr.match(
                /__EXIT__ (-?\d+)/
            );

            const signalMatch = stderr.match(
                /__SIGNAL__ (\d+)/
            );

            const memoryMatch = stderr.match(
                /__MEMORY__ (\d+)/
            )

            const timedOut = stderr.includes("__TLE__");

            const time = timeMatch
                ? Number(timeMatch[1])
                : null;

            const exitCode = exitMatch
                ? Number(exitMatch[1])
                : null;

            const signal = signalMatch
                ? Number(signalMatch[1])
                : null;

            const memory = memoryMatch
                ? Number(memoryMatch[1])
                : null

            const memoryMb = (memory !== null ? Math.round(memory / (1 << 20)) : 0);

            res({
                code,
                stdout,
                stderr,
                timedOut,
                signal,
                time,
                exitCode,
                memory: memoryMb
            })
        })
    })
}