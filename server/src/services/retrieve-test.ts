import { getQueryResults } from "./retrieve.service.ts";
async function run() {
    try {
        const query = "AI technology";
        const documents = await getQueryResults(query);
        console.log(documents?.length + " documents retrieved.");
        documents?.forEach( doc => {
            console.log(doc);
        }); 
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.stack);
        } else {
            console.log("An unknown error occurred.");
        }
    }
}
run().catch(console.dir);
