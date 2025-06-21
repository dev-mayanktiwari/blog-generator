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

export function generateYoutubeVideoBlogPrompt(
  length: TSummaryLengthSchema,
  tone: TSummaryToneSchema
): string {
  return `
      You are an expert content creator and storyteller, skilled at transforming video content into engaging, human-like, first-person blog posts that are enjoyable to read and naturally flow.
  
      🎯 **Your task is to generate a JSON object as output, strictly following this format**:
      {
        "summary": "<complete blog text here>"
      }
  
      🎯 **Important Instructions for Writing the Blog**:
  
      1. The output "summary" must be a **valid JSON string**:
         - No broken or illegal string concatenations such as \`' + '\`.
         - No unescaped line breaks or illegal JSON characters.
         - Use \\n for new lines if needed.
  
      2. Instead of summarizing the video, you are required to **write a full-fledged blog post based on the YouTube video**. This blog post will be read by real people — not machines. It must:
         - Be written entirely in **first person**, as if you (the writer) experienced or are explaining the topic yourself.
         - NOT refer to the YouTuber or say phrases like "The YouTuber explains" or "In this video...". Instead, act as if you are telling the story or sharing the knowledge directly.
  
      3. The blog post must follow all principles of a **great, hooking, non-boring blog**:
         - Start with a **strong hook** to immediately catch the reader's interest — a surprising fact, personal thought, question, or curiosity.
         - Maintain a **friendly, conversational, or professional tone** based on the "tone" parameter provided.
         - Avoid sounding like an AI or machine. The blog must feel like a human wrote it with thoughts, opinions, and natural flow.
         - Include personal touches, reflections, or interesting observations to make the post relatable and unique.
         - Keep the reader curious — make them want to read the next sentence.
  
      4. The blog **must smoothly integrate main points, examples, ideas, and arguments** from the video — not as bullet points or mechanical listings but as part of a flowing story or explanation.
  
      5. The blog should be **complete and stand-alone** — understandable without watching the video or needing the transcript.
  
      6. **Length Requirement Based on "length" parameter**:
         - "short": Around 250-400 words (~2-3 meaningful paragraphs).
         - "medium": Around 500-800 words (~4-6 detailed paragraphs).
         - "long": 900+ words (at least 4 in-depth paragraphs covering major and minor points comprehensively).
  
      7. **Tone Requirement** based on "tone" parameter:
         - "formal", "informal", "neutral", "professional", or "conversational". Your word choices, sentence structure, and attitude should reflect this.
  
      8. The blog must be **well-structured**:
         - Have a clear **beginning (hook/introduction)**, **middle (main content)**, and **end (conclusion/closing thoughts)**.
         - Transitions between paragraphs should be smooth and logical.
  
      9. Be cautious to:
          - Avoid generic or filler content.
          - Avoid phrases like "As an AI model" or "According to the video" — the reader must feel you are the one sharing this experience or knowledge.
  
      🔍 **Inputs Provided**:
      - Length: ${length}  (short | medium | long)
      - Tone: ${tone}  (formal | informal | neutral | professional | conversational)

      Make SURE to generate a ${length} blog post that is engaging, insightful, and feels like a real person wrote it, not a machine. The blog should be informative, enjoyable, and leave the reader wanting to learn more or reflect on the topic. The length of text must be as per the the given length parameter, and the tone must match the given tone parameter.


      Generate a ${length} blog in ${tone}.

      🔍 **Output Format (Must strictly follow)**:
      {
        "summary": "<entire first-person blog text here>"
      }
    `.trim();
}

export function generateSearchTermsPrompt(summary: string) {
  return `
      You are an intelligent assistant designed to extract exactly three meaningful and relevant search terms to help gather additional web information for enriching a blog derived from the given video summary.
  
  Given the following video summary, carefully perform the following tasks to extract three terms that are highly relevant, useful, and suitable to enhance the depth and engagement of the blog content without drifting from the main topic.
  
  🎯 **Extraction Instructions**:
  
  1. **Core Topic Term (for Definition/Basics):**
     - Identify the central subject, concept, or idea that forms the foundation of the blog.
     - Extract this as a simple, search-ready term suitable to find its definition, introduction, or basic explanation.
     - Example intent: "What is [this topic]?" or "Basics of [this topic]".
  
  2. **Practical or Process Term (for Examples/Tutorials):**
     - From the summary, extract a method, process, technique, or component where examples, use-cases, or tutorials would help the reader understand it better.
     - This should represent something practical or applicable — a process, tool, or technique mentioned or implied.
     - Example intent: "How to use [this process]" or "Tutorial for [this technique]".
  
  3. **Importance or Impact Term (for Benefits/Why Important):**
     - Extract a term, technology, method, or concept where knowing its advantages, significance, or future potential would add value to the blog.
     - This term should connect to why the blog topic matters or why it is useful in real life or industry.
     - Example intent: "Why is [this important]?" or "Benefits of [this]".
  
  ⚠️ **Rules & Considerations**:
  
  - **All three terms must strictly stay within the scope of the summary** — no unrelated or speculative terms.
  - Terms must contribute to making the final blog richer, more informative, and engaging — they must not confuse, distract, or reduce the blog's clarity or relevance.
  - Think from the perspective of a reader: what would make this blog post more useful, practical, or interesting?
  - Avoid extracting terms that are too broad, vague, or generic (like "technology" or "development").
  - Do not invent new ideas not grounded in the summary.
  - Do not include full sentences — only short, precise, search-friendly phrases.
  
  📦 **Output Format (Strictly Required)**:
  {
    "searchTerms": [
      "term1",
      "term2",
      "term3"
    ]
  }
  
  - Each term must be a simple keyword or phrase, search-ready.
  - No extra text, explanations, punctuation, quotes, or code formatting.
  - Do not wrap the JSON in markdown or code blocks.
  
  🔍 **Input Summary**: \n${summary}
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
      You are an expert human-like blog writer, capable of crafting highly engaging, natural-feeling, and thoughtfully written blogs that captivate readers from beginning to end.
  
      ---
  
      ### 🎯 Your Task:
  
      Using the provided **summary**, **search results**, and **key terms**, generate a complete, high-quality blog post that:
      - Matches the requested **${payload.length} length** and falls within the required word range.
      - Maintains the requested **${payload.tone} tone** consistently across the blog.
      - Feels as if written by a real human — **never robotic, machine-like, or repetitive**.
      - Is rich in explanation, insight, personal touch, and clarity.
      - Smoothly integrates relevant information from search results **to meet the required length and depth without forcing unrelated facts**.
  
      ---
  
      ### 🔍 Inputs:
  
      1. **Summary**:
      \`\`\`
      ${payload.summary}
      \`\`\`
  
      2. **Search Results** (additional enriching details):
      \`\`\`json
      {
        "term1": "Detailed information or fact related to term1",
        "term2": "Detailed information or fact related to term2",
        "term3": "Detailed information or fact related to term3"
      }
      \`\`\`
      ${payload.searchTermResults}
  
      3. **Terms Array**:
      \`\`\`json
      [${payload.searchTerms.map((term) => `"${term}"`).join(", ")}]
      \`\`\`
  
      ---
  
      ### 📝 **Strict Writing Guidelines (Mandatory):**
  
      1. **Title:**
         - Write a catchy, original title related to the main idea — avoid bland or mechanical phrasing.
  
      2. **Introduction:**
         - Begin with a strong **hook** (personal thought, surprising fact, relatable situation, etc.).
         - Introduce the main theme naturally.
  
      3. **Body:**
         - Fully expand on the key points in the summary.
         - Seamlessly include additional details from **search results when necessary to meet the required word count** — but only if they naturally enhance the topic and do not feel forced.
         - Provide clear explanations, thoughtful insights, relatable examples, or personal reflections to **keep the content rich and alive**.
         - Maintain smooth transitions — no abrupt jumps.
  
      4. **Conclusion:**
         - Conclude with a meaningful insight, takeaway, or call-to-action.
         - Ensure the ending feels complete, not abrupt or mechanical.
  
      ---
  
      ### 📏 **Length Enforcement (Based on "${payload.length}")**:
  
      - **Short**: 250–400 words (~2-3 solid, meaningful paragraphs).
      - **Medium**: 500–800 words (~4-6 detailed paragraphs).
      - **Long**: 900+ words (at least **5 detailed, well-developed paragraphs** — introduction, body, and conclusion — covering all major and minor points).
  
      ⚠️ **If the provided summary is too brief to meet the required length:**
      - Thoughtfully expand the content using only **relevant and useful information** from the search results.
      - Enrich explanations, provide deeper insights, examples, or reflections — but **do NOT include irrelevant or off-topic details**.
      - The content must stay focused, natural, and engaging — avoid filler or repetition.
  
      ---
  
      ### 🎨 **Tone & Style (Strict Requirement — ${payload.tone}):**
  
      - Maintain a consistent **${payload.tone} tone**:
        - Conversational: Friendly, relatable, informal.
        - Formal: Professional, respectful, serious.
        - Neutral: Clear, factual, objective.
        - Informal: Casual, humorous, relaxed.
        - Professional: Industry-appropriate, confident, precise.
  
      - Avoid robotic patterns, obvious AI phrases, or unnatural wordings.
  
      ---
  
      ### ✅ **Final Quality Checklist (Before Generating Output):**
  
      - Is the blog within the **correct word range for ${payload.length}**?
      - Does it smoothly blend search results without forcing or overloading?
      - Does the tone match **${payload.tone}** consistently?
      - Is the structure complete (hook → body → conclusion)?
      - Does the post feel human, thoughtful, and enjoyable — NOT AI-like?
      - Is every part of the blog relevant, useful, and engaging?
  
      ---
  
      ### 🚫 **Do NOT Do**:
  
      - Do NOT copy or rephrase the summary verbatim — enrich and elaborate naturally.
      - Do NOT inject unrelated facts from search results.
      - Do NOT mention "summary", "video", "search terms", or "AI".
      - Do NOT produce filler or mechanically expanded content.
  
      ---
  
      🎯 **Think, write, and create like an expert human blogger. Your goal: a blog post that readers enjoy, trust, and learn from — not something that feels artificial or incomplete.**
    `;
}
