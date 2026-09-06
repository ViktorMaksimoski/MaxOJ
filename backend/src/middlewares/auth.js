import { auth } from "../config/firebase.js";   

export async function authMiddleware(req, res, next) {
    try {
        const header = req.headers.authorization;

        if(!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const token = header.split(" ")[1];

        const decodedToken = await auth.verifyIdToken(token);

        req.user = decodedToken;
        next()
    } catch(err) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        })
    }
}