import { OpenAI } from "langchain/llms/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "langchain/prompts";
import { NextResponse } from "next/server";

import { z } from "zod";

// We can use zod to define a schema for the output using the `fromZodSchema` method of `StructuredOutputParser`.
const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    answer: z.string().describe("answer to the user's question"),
    sources: z
      .array(z.string())
      .describe("sources used to answer the question, should be websites."),
  })
);

const formatInstructions = parser.getFormatInstructions();

const prompt = new PromptTemplate({
  template:
    "Answer the users question as best as possible.\n{format_instructions}\n{question}",
  inputVariables: ["question"],
  partialVariables: { format_instructions: formatInstructions },
});

export async function POST(req) {
  try {
    console.log("z-schema api 2 processing");
    // Bind function arguments to the model.
    // All subsequent invoke calls will use the bound parameters.
    // "functions.parameters" must be formatted as JSON Schema
    // Omit "function_call" if you want the model to choose a function to call.

    const model = new OpenAI({ temperature: 0 });

    const input = await prompt.format({
      question: "What is the capital of France?",
    });
    const response = await model.call(input);

    console.log("input => " + input);

    console.log("response => " + response);

    const result = await parser.parse(response);

    return NextResponse.json(result);
  } catch (error) {
    console.warn("failed to tranlsate");
    console.error(error);
  }
}
