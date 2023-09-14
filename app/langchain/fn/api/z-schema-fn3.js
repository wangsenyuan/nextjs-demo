import { NextResponse } from "next/server";

import { z } from "zod";

import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  OutputFixingParser,
  StructuredOutputParser,
} from "langchain/output_parsers";
import { PromptTemplate } from "langchain/prompts";

const outputParser = StructuredOutputParser.fromZodSchema(
  z
    .array(
      z.object({
        fields: z.object({
          Name: z.string().describe("The name of the country"),
          Capital: z.string().describe("The country's capital"),
        }),
      })
    )
    .describe("An array of Airtable records, each representing a country")
);

const chatModel = new ChatOpenAI({
  modelName: "gpt-3.5-turbo", // Or gpt-3.5-turbo
  temperature: 0, // For best results with the output fixing parser
});

const outputFixingParser = OutputFixingParser.fromLLM(chatModel, outputParser);

// Don't forget to include formatting instructions in the prompt!
const prompt = new PromptTemplate({
  template: `Answer the user's question as best you can:\n{format_instructions}\n{query}`,
  inputVariables: ["query"],
  partialVariables: {
    format_instructions: outputFixingParser.getFormatInstructions(),
  },
});

const answerFormattingChain = new LLMChain({
  llm: chatModel,
  prompt,
  outputKey: "records", // For readability - otherwise the chain output will default to a property named "text"
  outputParser: outputFixingParser,
});

export async function POST(req) {
  try {
    console.log("z-schema api 3 processing");

    const result = await answerFormattingChain.call({
      query: "List 5 countries.",
    });

    console.log(JSON.stringify(result.records, null, 2));

    return NextResponse.json(result);
  } catch (error) {
    console.warn("failed to tranlsate");
    console.error(error);
  }
}
