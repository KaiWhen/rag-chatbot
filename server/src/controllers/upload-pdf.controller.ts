import type { Request, Response } from "express-serve-static-core";
import { ingestData } from "../services/ingest.service";

export async function handleUploadPdfController(
    req: Request,
    res: Response,
): Promise<any> {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: "No file uploaded"
            });
        }

        await ingestData(req.file.path, req.file.filename);

        return res.status(200).json({ success: true });

    } catch (err) {
        if (err instanceof Error) {
            console.log(err.stack);
            res.status(500).send("Internal Server Error");
        } else {
            console.log("An unknown error occurred.");
            res.status(500).send("Internal Server Error");
        }
    }
}
