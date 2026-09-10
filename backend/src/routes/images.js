import express from 'express'
import { getImage } from '../utils/getImage.js';
import { cacheImage } from '../utils/imageCache.js';

const router = express.Router();

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    const { name } = req.query;
    const imageUrl = await cacheImage(`${pid}/${name}`)

    if(imageUrl == "NotFound") {
        return res.status(404).json({
            success: false,
            imageUrl
        })
    }

    res.json({
        success: true,
        imageUrl
    })
})

export default router

