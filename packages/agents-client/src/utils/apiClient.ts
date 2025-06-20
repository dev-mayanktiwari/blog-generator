import { TSummarizeYoutubeVideoSchema } from "@workspace/types";
import axios, { AxiosInstance } from "axios";

const BASE_URL = process.env.AGENTS_API_URL || "http://localhost:8000";

export class AgentsClient {
  private client: AxiosInstance;

  constructor(baseURL: string = BASE_URL) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        withCredentials: true,
      },
    });
  }

  async get_transcript(request: TSummarizeYoutubeVideoSchema) {
    try {
      const response = await this.client.post("/flows/generate-blog", request);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async healthCheck(): Promise<{ status: string }> {
    const response = await this.client.get("/health");
    return response.data;
  }

  private handleError(error: any): Error {
    if (error.response?.data?.error) {
      return new Error(error.response.data.error);
    }
    return new Error(error.message || "Unknown error occurred");
  }
}

// Export a default instance
export const agentsClient = new AgentsClient();

// Export factory function for custom URLs
export const createAgentsClient = (baseURL: string) =>
  new AgentsClient(baseURL);
