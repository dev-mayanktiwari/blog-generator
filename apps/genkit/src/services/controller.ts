import { Request, Response } from "express";
import { summarizeYoutubeVideoSchema } from "@workspace/types";
import { AppConfig } from "../config";
import { generateBlogFlow } from "../flows/05generateBlogFlow";

export const generateBlogController = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const safeParse = summarizeYoutubeVideoSchema.safeParse(body);
    if (!safeParse.success) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // Validate API Key
    const apiKey = req.headers.authorization;
    const API_KEY = apiKey?.split(" ")[1];
    if (!API_KEY || API_KEY !== AppConfig.get("GENKIT_API_KEY")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await generateBlogFlow(safeParse.data);
    res.status(200).json(result);
  } catch (error) {
    // console.error("Error generating blog:", error);
    res.status(500).json({ error: "Failed to generate blog" });
  }
};
