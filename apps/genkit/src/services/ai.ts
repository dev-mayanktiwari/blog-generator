import { googleAI } from "@genkit-ai/googleai";
import { genkit } from "genkit";

const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_AI_API_KEY,
    }),
  ],
  model: googleAI.model("gemini-2.0-flash"),
});

export default ai;
