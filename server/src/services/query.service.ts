import { generateResponse } from "./generate-responses.service";

export async function handleQuery(query: string, filename: string): Promise<string> {
    const response = await generateResponse(query, filename);
    if (!response) {
        return "Failed to generate a response.";
    }
    return response;
}
