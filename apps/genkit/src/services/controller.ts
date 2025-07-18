import { Request, Response } from "express";
import { summarizeYoutubeVideoSchema } from "@workspace/types";
import { generateBlogFlow } from "../flows/06generateBlogFlow";
import { logger } from "@workspace/utils";

export const generateBlogController = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const safeParse = summarizeYoutubeVideoSchema.safeParse(body);
    if (!safeParse.success) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const result = await generateBlogFlow(safeParse.data);
    res.status(200).json(result);
  } catch (error) {
    // console.error("Error generating blog:", error);
    logger.error("Error generating blog", {
      meta: {
        error,
      },
    });
    res.status(500).json({ error: "Failed to generate blog", cause: error });
  }
};
