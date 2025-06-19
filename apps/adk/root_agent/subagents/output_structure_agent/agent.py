from google.adk.agents import Agent
from pydantic import BaseModel


class WebSearchResult(BaseModel):
    term1: str
    term2: str
    term3: str
    
output_structure_agent = Agent(
    name="OutputStructureAgent",
    model="gemini-2.5-pro-preview-03-25",
    description=(
        "An agent that transforms raw web search results into a structured JSON object with clear fields: "
        "'definition', 'examples', and 'importance'. This helps in generating organized, readable content for blogs."
    ),
    instruction="""
    You will receive the output from the 'web_search_agent' in the following string format:

    {
        "term1": "<search result for term1>",
        "term2": "<search result for term2>",
        "term3": "<search result for term3>"
    }

    Your task is to carefully extract and transform this data into a structured JSON object with the following fields:

    {
        "term1": "<search result for term1>",
        "term2": "<search result for term2>",
        "term3": "<search result for term3>"
    }

    Notes:
    1. Use the content of 'term1' to populate 'definition'.
    2. Use the content of 'term2' to populate 'examples'.
    3. Use the content of 'term3' to populate 'importance'.
    4. Provide concise, meaningful text in each field.
    5. Do not add any extra information, summary, or commentary — only transform the input as per the required format.

    Ensure the output strictly matches the defined JSON structure and schema.
    """,
    output_schema=WebSearchResult
)