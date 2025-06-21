import {
  searchTermResultSchema,
  searchTermsSchema,
  StreamRequest,
} from "@workspace/types";
import axios from "axios";
import { AppConfig } from "../config";
import ai from "../services/ai";
import { v4 as uuidv4 } from "uuid";

export const fetchSearchTermDetailsTool = ai.defineTool(
  {
    name: "fetchSearchTermDetails",
    inputSchema: searchTermsSchema,
    description: "Fetches details for the given search term array",
    outputSchema: searchTermResultSchema,
  },
  async ({ searchTerms }) => {
    console.log(
      "Search terms received in fetchSearchTermDetailsTool:",
      searchTerms
    );
    try {
      const sessionId = uuidv4();
      const userId = uuidv4();
      const sessionCreationPayload = {
        state: { preferred_language: "English", visit_count: 1 },
      };

      await axios.post(
        `${String(AppConfig.get("AGENT_URL"))}/apps/${String(AppConfig.get("AGENT_APP_NAME"))}/users/${userId}/sessions/${sessionId}`,
        sessionCreationPayload
      );

      const payload: StreamRequest = {
        app_name: String(AppConfig.get("AGENT_APP_NAME")),
        user_id: userId,
        session_id: sessionId,
        new_message: {
          role: "user",
          parts: [
            {
              text: String(searchTerms),
            },
          ],
        },
        streaming: false,
      };

      const response = await axios.post(
        `${String(AppConfig.get("AGENT_URL"))}/run_sse`,
        payload,
        {
          responseType: "stream",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return new Promise((resolve, reject) => {
        let chunks: string[] = [];
        let buffer = "";

        response.data.on("data", (chunk: Buffer) => {
          buffer += chunk.toString();

          // Split by "data: " to separate SSE events
          const lines = buffer.split("\n");

          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i]?.trim();
            if (line?.startsWith("data: ")) {
              const jsonStr = line.substring(6); // Remove "data: " prefix
              chunks.push(jsonStr);
            }
          }

          // Keep the last incomplete line in buffer
          buffer = lines[lines.length - 1]!;
        });

        response.data.on("end", () => {
          try {
            // Process any remaining data in buffer
            if (buffer.trim().startsWith("data: ")) {
              const jsonStr = buffer.trim().substring(6);
              chunks.push(jsonStr);
            }

            console.log(`Received ${chunks.length} SSE events`);

            if (chunks.length < 2) {
              throw new Error("Expected at least 2 SSE events, received fewer");
            }

            // Parse the second event (index 1)
            const secondEventData = JSON.parse(chunks[1]!);
            console.log("Second event data:", secondEventData);

            // Extract content from the second event
            const content = secondEventData?.content?.parts?.[0]?.text;

            if (!content) {
              throw new Error("No content found in second SSE event");
            }

            console.log("Extracted content:", content);

            // Parse the JSON content to get structured data
            const structuredData = JSON.parse(content);
            console.log("Structured data from content:", structuredData);
            // Validate the structure and return
            if (
              structuredData.term1 &&
              structuredData.term2 &&
              structuredData.term3
            ) {
              resolve(structuredData);
            } else {
              throw new Error("Invalid data structure: missing required terms");
            }
          } catch (parseError) {
            console.error("Error parsing SSE response:", parseError);
            console.error("Raw chunks:", chunks);
            reject(new Error(`Failed to parse SSE response: ${parseError}`));
          }
        });

        response.data.on("error", (err: Error) => {
          console.error("Stream error:", err);
          reject(err);
        });
      });
    } catch (error) {
      console.error("Error fetching search term details:", error);
      throw new Error(`Failed to fetch search term details: ${error}`);
    }
  }
);
