import type { Request, Response } from 'express-serve-static-core';
import { ingestData } from '../services/ingest.service';
import fs from 'fs';

export async function handleUploadPdfController(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
      });
    }
    console.log('File', req.body.filename);

    const newPath = `uploads/${req.body.filename}`;
    fs.rename(req.file.path, newPath, (err) => {
      if (err) {
        console.error('Error renaming file:', err);
      } else {
        console.log('File renamed successfully');
      }
    });

    await ingestData(newPath, req.body.filename);

    return res.status(200).json({ success: true });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.stack);
      res.status(500).json({ success: false, error: err.message });
    } else {
      console.log('An unknown error occurred.');
      res.status(500).json({ success: false, error: 'An unknown error occurred.' });
    }
  }
}
