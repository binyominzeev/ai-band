import express from 'express';
import multer from 'multer';
import { AccompanimentService } from '../services/accompanimentService';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const accompanimentService = new AccompanimentService();

router.post('/upload', upload.single('audio'), async (req, res) => {
    try {
        const audioFilePath = req.file.path;
        const accompaniment = await accompanimentService.generateAccompaniment(audioFilePath);
        res.json({ accompaniment });
    } catch (error) {
        res.status(500).json({ error: 'Error generating accompaniment' });
    }
});

router.get('/status', (req, res) => {
    res.json({ status: 'API is running' });
});

export default router;