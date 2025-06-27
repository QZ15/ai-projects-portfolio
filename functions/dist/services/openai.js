// functions/src/services/openai.ts
import OpenAI from "openai";
import { config } from "firebase-functions";
const openai = new OpenAI({
    apiKey: config().openai.key,
});
export default openai;
