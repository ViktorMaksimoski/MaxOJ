import express from 'express'
import { db } from './config/firebase.js'
import submissionRouter from './routes/submission.js'
import codesRouter from './routes/codes.js'
import cors from "cors"
import { cacheCleanup } from './utils/cacheCleanup.js'

const PORT = 5001;
const app = express();

const origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.use(cors({
    origin: origins,
}))

//middlewares
app.use(express.json({ limit: "30kb" }))

app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "Hello from backend",
    });
})

app.get("/firebase-test", async (_req, res) => {
    try {
        const ref = db.collection("healthchecks").doc("backend");
        await ref.set({
            ok: true,
            checkedAt: new Date().toISOString(),
        });

        const snapshot = await ref.get();

        res.json({
            success: true,
            data: snapshot.data(),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
})

app.use("/api/submission", submissionRouter)

app.use('/api/codes', codesRouter)

//start server
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`)

    setInterval(() => {
        cacheCleanup();
    }, 5 * 60 * 1000)
})
