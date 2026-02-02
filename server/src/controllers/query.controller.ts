import type { Request, Response } from "express-serve-static-core";
import { handleQuery } from "../services/query.service";

export async function handleQueryController(
    req: Request,
    res: Response,
): Promise<any> {
    try {
        const query = req.body as string;

        if (!query || typeof query !== "string") {
            return res.status(400).json({
                error: "Query must be a non-empty string"
            });
        }

        const response = await handleQuery(query);
        return res.status(200).json({ response });

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
