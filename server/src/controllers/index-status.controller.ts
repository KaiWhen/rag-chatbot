import type { Request, Response } from 'express';
import { checkIndexStatus } from '../services/vector-index.service.js';

export async function indexStatusController(req: Request, res: Response) {
  try {
    const filename = req.body.filename;

    if (!filename) {
      return res.status(400).json({ error: 'filename required' });
    }
    const status = await checkIndexStatus(filename);
    res.json({ ready: status });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.stack);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('An unknown error occurred.');
      res.status(500).send('Internal Server Error');
    }
  }
}
