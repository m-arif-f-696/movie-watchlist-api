import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { env } from "./env";

const google = createGoogleGenerativeAI({
    apiKey: env.GEMINI_API_KEY
});

export default google;