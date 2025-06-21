// import { startFlowServer, withContextProvider } from "@genkit-ai/express";
import { generateBlogFlow } from "./flows/05generateBlogFlow";
// import { summariseYoutubeVideoFlow } from "./flows/01summariseYoutubeVideoFlow";
// import { generateSearchTermsFlow } from "./flows/02generateSearchTerms";
// import { generateFinalSummaryFlow } from "./flows/04generateFinalSummaryFlow";
// import { apiKey } from "genkit/context";
import { AppConfig } from "./config";
import express, { Application } from "express";
import { Request, Response } from "express";
import { summarizeYoutubeVideoSchema } from "@workspace/types";
import { generateBlogController } from "./services/controller";

// startFlowServer({
//   flows: [
//     summariseYoutubeVideoFlow,
//     generateSearchTermsFlow,
//     generateFinalSummaryFlow,
//     withContextProvider(
//       generateBlogFlow,
//       apiKey(String(AppConfig.get("GENKIT_API_KEY")))
//     ),
//   ],
//   pathPrefix: "/flows",
//   cors: {
//     origin: String(AppConfig.get("CORS_ORIGIN")),
//     methods: ["GET", "POST", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   },
// });

const app: Application = express();

app.use(express.json());

//@ts-ignore
app.post("/generate-blog", generateBlogController);

app.listen(AppConfig.get("PORT"), () => {
  console.log(`Server is running on port ${AppConfig.get("PORT")}`);
});
