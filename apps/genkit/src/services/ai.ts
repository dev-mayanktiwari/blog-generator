import { googleAI } from "@genkit-ai/googleai";
import { genkit } from "genkit";
import { AppConfig } from "../config";
import vertexAI from "@genkit-ai/vertexai";

// console.log("Gemini api key:", AppConfig.get("GEMINI_API_KEY"));
const ai = genkit({
  plugins: [
    googleAI({
      apiKey: String(AppConfig.get("GEMINI_API_KEY")),
    }),
  ],
  model: googleAI.model("gemini-2.5-pro"),
});

export const imageAi = genkit({
  plugins: [
    vertexAI({
      location: String(AppConfig.get("VERTEX_AI_LOCATION")),
      projectId: String(AppConfig.get("GOOGLE_CLOUD_PROJECT_ID")),
    }),
  ],
  model: vertexAI.model("imagen-3.0-fast-generate-001"),
});

export default ai;
