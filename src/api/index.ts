import express, { Request, Response } from 'express';
import multer from 'multer';
import AccompanimentService from '../services/accompanimentService';
import ffmpeg from 'fluent-ffmpeg';
import { PassThrough } from 'stream';
import MusicTempo from 'music-tempo';

// At the top of your file (temporary quick fix)
declare module 'music-tempo';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const accompanimentService = new AccompanimentService();

// Extend Request type for multer
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Helper to convert MP3 file to WAV buffer
function mp3ToWavBuffer(mp3Path: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const stream = new PassThrough();
    const chunks: Buffer[] = [];
    ffmpeg(mp3Path)
      .format('wav')
      .on('error', reject)
      .pipe(stream);

    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

router.post('/upload', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No audio file uploaded' });
            return;
        }
        const audioFilePath = req.file.path;
        // Read the audio file as a Buffer
        const fs = await import('fs/promises');
        const rawAudio = await fs.readFile(audioFilePath);
        const styleDescription = req.body.styleDescription || 'default style';
        const accompaniment = await accompanimentService.generateAccompaniment(rawAudio, styleDescription);
        res.json({ accompaniment });
    } catch (error) {
        res.status(500).json({ error: 'Error generating accompaniment' });
    }
});

router.post('/analyze', upload.single('audio'), async (req: MulterRequest, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No audio file uploaded' });
      return;
    }

    // Convert MP3 to WAV buffer
    const wavBuffer = await mp3ToWavBuffer(req.file.path);

    // Decode WAV file
    const audioData = await wav.decode(wavBuffer);

    // Use left channel or mono
    const channelData = audioData.channelData[0];

    // Downsample for performance (optional)
    const downsampled = channelData.filter((_, i) => i % 10 === 0);

    // Calculate onset times (very basic energy-based onset detection)
    const threshold = 0.2;
    let lastOnset = -10000;
    const onsets: number[] = [];
    for (let i = 0; i < downsampled.length; i++) {
      if (Math.abs(downsampled[i]) > threshold && i - lastOnset > 1000) {
        onsets.push(i);
        lastOnset = i;
      }
    }

    // Convert onset indices to times (seconds)
    const sampleRate = audioData.sampleRate / 10;
    const times = onsets.map(i => i / sampleRate);

    // Use music-tempo to estimate BPM
    const mt = new MusicTempo(times);
    const tempo = Math.round(mt.tempo);

    res.json({
      tempo,
      chords: ['C', 'G', 'Am', 'F'] // Placeholder for chords
    });
  } catch (error) {
    res.status(500).json({ error: 'Error analyzing audio file', details: error instanceof Error ? error.message : error });
  }
});

router.get('/status', (req, res) => {
    res.json({ status: 'API is running' });
});

export default router;