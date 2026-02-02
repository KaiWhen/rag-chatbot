import { generateResponse } from "./generate-responses.service";

export async function handleQuery(query: string): Promise<string> {
    const response = await generateResponse(query);
    if (!response) {
        return "Failed to generate a response.";
    }
    return response;
}
