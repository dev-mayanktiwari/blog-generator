import {
  TGenerateBlogSchema,
  TSearchTermsSchema,
  TSummaryContentTypeSchema,
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
  tone: TSummaryToneSchema,
  contentType: TSummaryContentTypeSchema
): string {
  return `
You are a skilled content creator and storyteller, capable of transforming YouTube video content into engaging, human-like blog posts that flow naturally and resonate with readers.

📘 **Blog Type**: "${contentType}" (e.g., informative, tutorial, opinion, summary, narrative)  
🗣️ **Tone**: "${tone}"  
✏️ **Length**: "${length}" (short ≈ 250–400 words, medium ≈ 500–800, long = 900+)

---

🎯 **Your Goal**:  
Write a **complete, human-written blog post**, not a robotic summary. The blog must sound like a real person who deeply understands the topic and is communicating naturally.

📐 **Strict Word Count Compliance**:
✅ You **must strictly meet the target length** (${length}):
- Do **not** end early.
- If the content feels too short, **expand with examples, analogies, or deeper explanation**.
- Elaborate naturally — add context, observations, or transitions to increase depth without padding.

🧠 **Voice & Perspective Strategy**:
Use a **balanced, human tone** — just like real blogs. The perspective should feel organic:
- Use **first-person (“I”, “my”)** when reflecting, sharing experiences, or giving opinions.
- Use **second-person (“you”)** to guide or instruct the reader, especially in tutorials or persuasive content.
- Use a **neutral or general tone** when discussing facts, trends, or universal insights.
- Create a balance accordingly.

✨ For example:
- In a tutorial: explain steps using "you", while occasionally bringing in personal tips ("I usually do this...")
- In a review or opinion: lean on "I" to express genuine experience or judgment.
- In informative or environmental blogs: use mostly general/third-person, but add personal touches for relatability.

---

📋 **Structure Instructions**:
- Start with a strong **hook** — a relatable idea, question, or insight.
- Develop a logical flow — avoid robotic listing or dry information dumps.
- End with a thoughtful conclusion, takeaway, or subtle call to action (if suitable).

✍️ **Content Rules**:
- Integrate key points from the video **naturally** — don’t just rephrase or list them.
- Avoid fluff. Add value through storytelling, reflection, clarity, or depth.
- Use transitions that keep the reader engaged.
- Match the writing tone and structure to the blog type:
  - Tutorial → Clear, structured, friendly
  - Review → Honest, reflective, opinionated
  - Informative → Clear, structured, and fact-based
  - Opinion → Persuasive, passionate, reasoned

🚫 **Do Not**:
- Mention “the video”, “YouTuber”, or “this video says”.
- Sound like a machine or AI.
- End prematurely. Always hit the minimum word requirement for "${length}".

---

📦 **Output Format (Must be valid JSON)**:
{
  "summary": "<entire blog post here>"
}

Now, generate a high-quality, ${length}-length blog in a ${tone} tone based on a "${contentType}" format. Keep the writing natural and insightful. Strictly meet the required length by thoughtfully expanding the content where necessary.
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

export function enhanceBlogWithSearchResultsPrompt(
  payload: TGenerateBlogSchema
): string {
  return `
You are a senior blog editor with expertise in elevating good content into great content.

You have already been provided with a **well-written base blog post** generated from a YouTube video. Your job is to now **enhance and refine this blog**, using carefully curated **search results for key terms**, in order to:
- Add contextual depth
- Improve clarity and credibility
- Meet the required word count
- Deliver a richer, more informative and engaging final piece

---

🎯 **Your Task**:

Without rewriting or replacing the blog, **carefully revise and enrich it** using only the provided search result insights. Treat the original blog as your foundation — maintain its core tone, structure, and flow — and elevate it with additional facts, elaborations, or clarifications.

---

📦 **Inputs Provided**:

1. **Base Blog**:
\`\`\`
${payload.summary}
\`\`\`

2. **Search Result Insights**:
\`\`\`json
${payload.searchTermResults}
\`\`\`

3. **Terms Extracted for Enrichment**:
\`\`\`json
[${payload.searchTerms.map((term) => `"${term}"`).join(", ")}]
\`\`\`

---

🧠 **What to Do**:

- **Carefully read the blog** and look for areas where ideas could be expanded, explained better, or backed by relevant facts.
- **Integrate** search result insights only where they feel **naturally helpful and connected** to what’s being discussed.
- Expand short sections with richer context, relatable analogies, examples, or supporting facts.
- Ensure the final blog continues to feel human, insightful, and true to its original tone.

---

📏 **Length Enforcement (Strict)**:
- **Short**: 250–400 words
- **Medium**: 500–800 words
- **Long**: 900+ words (must be deeply detailed and well-structured)

If the base blog is not long enough:
- Thoughtfully **expand** with additional insight from the search results.
- Add narrative depth — but **no fluff, no repetition**.
- Prioritize clarity and helpfulness.

---

📝 **Writing Guidelines**:

- Do not remove or rewrite the original content unless necessary to improve flow or clarity.
- **Preserve the blog's original tone**: ${payload.tone}
- Keep structure aligned to the original **content type**: ${payload.contentType}
- Ensure smooth transitions when inserting new insights.
- Maintain natural, reader-friendly pacing.

---

🚫 **Avoid the Following**:

- Do NOT say "search results", "terms", "video", or "summary".
- Do NOT overload the post with unrelated or excessive facts.
- Do NOT rewrite the whole blog from scratch.
- Do NOT break the JSON format in the output.

---

✅ **Final Output Format (Strict JSON)**:

{
  "summary": "<final enhanced blog here>"
}


---

🎯 Final Mission:
> You are here to take a well-written blog and make it **more valuable, more complete, and more insightful** — without losing its human tone or narrative flow.

Think like a human editor working for a top publication. The final result should feel like a **fully polished, high-quality blog** that educates, connects, and satisfies the reader — all while subtly incorporating new depth.
  `.trim();
}

export function generateImagePrompt(summary: string): string {
  return `
      You are generating a blog illustration using summary. You are a professional image generation agent. The blog is based on a YouTube video and is intended for readers of a specific type. The image you generate will be placed at the top of the blog post, so it should visually represent the theme, message, and emotional tone of the content. It should align with the writing style, reader profile, and content type. Use the full context below to create a coherent, visually appealing image that enhances the blog's storytelling and message.
      
      Here are the details you need to consider:

      - **Summary**: ${summary}

      🎨 Visual Instructions:
	      •	Focus on the central themes mentioned in the summary.
	      •	The style should be appropriate for a blog header image. Avoid overly detailed or complex scenes.
	      •	Preferably no text in the image unless absolutely necessary.
	      •	Use symbols or metaphors relevant to the topic (e.g., brain and circuits for AI, trees and globe for sustainability, etc.).
	      •	Ensure the image is clean, aesthetic, and mobile-friendly.

    ⸻

        🖼️ Image Format: Horizontal blog banner, 1200x600px.
`;
}
