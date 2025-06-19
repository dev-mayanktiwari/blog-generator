import {
  TGenerateBlogSchema,
  TSearchTermsSchema,
  TSummaryLengthSchema,
  TSummaryToneSchema,
} from "@workspace/types";

export function summarizeTranscriptPrompt(
  transcript: string,
  length: TSummaryLengthSchema,
  tone: TSummaryToneSchema
): string {
  return `You are an AI language model designed to summarize video transcripts.
  Below is the transcript content:
  "${transcript}"
  
  Please generate a ${length} summary with a ${tone} tone, clearly highlighting the key points and main ideas discussed.`;
}

export function summarizeYoutubeVideoPrompt(
  length: TSummaryLengthSchema,
  tone: TSummaryToneSchema
): string {
  return `
    You are an expert summarizer trained to carefully analyze and summarize entire video content without missing important details.
  
    Your task is to generate a JSON object as output, strictly following this format:
    {
      "summary": "<complete summary text here>"
    }
  
    🎯 **Important Rules**:
    1. The "summary" value **must be a single valid JSON string**:
        - No illegal string concatenations such as \`' + '\` or any stray plus signs.
        - No unescaped line breaks or characters that would make the JSON invalid.
        - Use \\n for new lines inside the summary if needed.
    
    2. The summary must fully cover the video's main ideas, arguments, points, and examples.
  
    3. The summary length should be appropriate for the given "length" parameter:
        - "short": 2-3 concise paragraphs.
        - "medium": 4-6 detailed paragraphs.
        - "long": Comprehensive with all major and minor details.
  
    4. The summary tone must match the "tone" parameter:
        - "formal", "informal", "neutral", "professional", or "conversational".
  
    5. The summary should be proportional — all sections of the video should be represented relative to their importance and detail in the source.
  
    6. The summary must stand alone — understandable without needing the video or transcript.
  
    Length: ${length}  (short | medium | long)
    Tone: ${tone} (formal | informal | neutral | professional | conversational)
    `.trim();
}

export function generateSearchTermsPrompt(summary: string) {
  return `
        You are an intelligent assistant designed to help gather additional web information to enrich a blog derived from a video summary.

Given the following video summary, perform the following tasks carefully:

1. **Main Topic Extraction (for Definition/Basics):**
   - Identify the main subject or concept discussed in the summary.
   - Output this as a simple phrase or term that can be searched with "definition" or "basics explained".

2. **Video-Specific Query (for Examples/Tutorials):**
   - Based on the summary, extract a key concept, process, or method that could benefit from practical examples or tutorials.
   - Output this as a search phrase that could be paired with "examples" or "step by step".

3. **Importance Query (for Benefits/Why Important):**
   - Identify a key term, idea, or technology from the summary where its significance or benefits should be explained.
   - Output this as a search phrase that can be paired with "benefits" or "why important".

⚠️ Rules:
- Do not output full sentences — only concise search-friendly phrases.
- Do not invent new concepts not present in the summary.
- Your output should be only the three extracted search-ready terms under the following headings:

Output:
- Strictly follow the output schema given in the output format.
- Output MUST STRICTLY BE IN JSON FORMAT:
    {
      "searchTerms": [
        "term1",
        "term2",
        "term3"
        ]
    }
- Each term should be a single phrase or keyword, ready for web search.
- Do not include any additional text or explanations outside the JSON format.
- Do not include any punctuation, quotes, or special characters in the terms.
- Do not add any markdown formatting or code blocks.

Here is the summary: \n${summary}
    `;
}

export function generateSearchTermsResultsPrompt(
  searchTerms: TSearchTermsSchema
): string {
  return `
  You are provided with the following array of exactly three search terms:
  
  ${searchTerms.searchTerms}
  
  Instructions:
  
  1. You MUST use the tool named "fetchSearchTermDetails" to fetch details for these search terms.
  2. Pass the array ${searchTerms.searchTerms} directly to the tool as input without any modifications.
  3. You are STRICTLY PROHIBITED from generating or predicting the result yourself. The tool must be called.
  4. Once you receive the tool's response:
     - If the response matches the expected format shown below, return it as-is.
     - If the response does NOT match the expected format, you must extract or arrange the information into the following structure:
  
  {
    "term1": "Output related to the first search term",
    "term2": "Output related to the second search term",
    "term3": "Output related to the third search term"
  }
  
  5. Each key ("term1", "term2", "term3") must contain meaningful, complete, and relevant information corresponding to its respective search term.
  6. You must ensure the final output is a valid JSON object — no extra text, no markdown, no explanations — only the pure JSON object as the response.
  7. DO NOT leave any field empty, null, or undefined.
  
  ⚠️ Failure to:
  - Use the tool,
  - Arrange the output into the required structure,
  - Return a valid JSON object, else it
  will result in task failure.
    `;
}

export function generateBlogPrompt(payload: TGenerateBlogSchema): string {
    console.log("Payload for generateBlogPrompt:", payload);
  return `
  You are a skilled, human-like content writer tasked to create an **engaging, well-structured blog post** that feels natural, thoughtful, and NOT like machine-generated content.
  
  ### Your Task:
  Based on the **summary**, the **search results**, and the provided **key terms**, write a blog post that:
  - Is of **${payload.length} length**.
  - Uses a **${payload.tone} tone**.
  - Is informative, interesting, and reader-friendly.
  - Includes a smooth introduction, insightful body, and a natural conclusion.
  - Blends additional knowledge from the search results seamlessly — **only when relevant** — to enrich the post.
  
  ---
  
  ### Inputs Provided:
  
  1. **Summary** (content source):
  
  \`\`\`
  ${payload.summary}
  \`\`\`
  
  ---
  
  2. **Search Results** (additional information to enhance content):

  \`\`\`json
  {
    "term1": "Detailed information or fact related to term1",
    "term2": "Detailed information or fact related to term2",
    "term3": "Detailed information or fact related to term3"
  }
  \`\`\`

   ${payload.searchTermResults}
  
  - These correspond to the following **terms array**:
  
  \`\`\`json
  [${payload.searchTerms.map((term) => `"${term}"`).join(", ")}]
  \`\`\`
  
  Explanation:
  - Each key in \`searchResults\` is a term from the \`terms[]\` array.
  - The value is a **relevant fact or detailed explanation** related to that term.
  
  ---
  
  ### Writing Instructions (Mandatory):
  
  1. Carefully read and understand the **summary** to grasp the main ideas, themes, and context.
  2. Review the **search results JSON**:
     - Use only those facts that are **directly relevant** to the summary's content or theme.
     - Do **not force or awkwardly insert unrelated information**.
     - Blend this extra knowledge naturally into the blog where it makes sense.
  3. Structure your blog post in this format:
     - **title**: A catchy, human-like title relevant to the content.
     - **content**: Briefly introduce the main topic in an engaging way. Expand upon the key points from the summary while smoothly incorporating relevant search result facts. Summarize and close the article with a thoughtful remark or takeaway.
  4. Write the post in a **${payload.tone} tone** — make it human, relatable, and free from robotic or AI-like patterns.
  5. **Avoid obvious AI markers** such as repetitive phrases, overly formal wording (unless explicitly formal tone), or unnatural transitions.
     - **Conclusion**: 
  6. Do **NOT mention that this is based on a summary or AI-generated** in any way.
  
  
  Think like an expert human writer — your goal is to deliver a post that feels organic, insightful, and naturally written.
  `;
}
