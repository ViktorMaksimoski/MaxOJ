import express from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import { db } from '../config/firebase.js';
import { userViewLimit } from '../middlewares/userViewLimit.js';

const router = express.Router()

router.get('/', authMiddleware, async (req, res) => {
    const uid = req.user.uid;

    const { success, reset } = await userViewLimit.limit(uid);

    if(!success) {
        return res.status(429).json({
            success: false,
            message: "Го надминавте лимитот за гледање профили. Почекајтe"
        })
    }

    const data = (await db.collection('users').doc(uid).get()).data();

    res.json({
        success: true,
        data
    })
})

export default router