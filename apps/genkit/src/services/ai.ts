import { googleAI } from "@genkit-ai/googleai";
import { genkit } from "genkit";
import { AppConfig } from "../config";

// console.log("Gemini api key:", AppConfig.get("GEMINI_API_KEY"));
const ai = genkit({
  plugins: [
    googleAI({
      apiKey: String(AppConfig.get("GEMINI_API_KEY")),
    }),
  ],
  model: googleAI.model("gemini-2.0-flash"),
});

export default ai;
