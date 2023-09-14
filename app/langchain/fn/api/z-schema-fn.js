import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema";
import { NextResponse } from "next/server";

import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const extractionFunctionZodSchema = z.object({
  tone: z
    .enum(["positive", "negative"])
    .describe("The overall tone of the input"),
  entity: z.string().describe("The entity mentioned in the input"),
  word_count: z.number().describe("The number of words in the input"),
  chat_response: z.string().describe("A response to the human's input"),
  final_punctuation: z
    .optional(z.string())
    .describe("The final punctuation mark in the input, if any."),
});

export async function POST(req) {
  try {
    console.log("z-schema api processing");
    // Bind function arguments to the model.
    // All subsequent invoke calls will use the bound parameters.
    // "functions.parameters" must be formatted as JSON Schema
    // Omit "function_call" if you want the model to choose a function to call.
    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
    }).bind({
      functions: [
        {
          name: "extractor",
          description: "Extracts fields from the input.",
          parameters: zodToJsonSchema(extractionFunctionZodSchema),
        },
      ],
      function_call: { name: "extractor" },
    });

    console.log("ask gpt");
    const result = await model.invoke([
      new HumanMessage("What a beautiful day!"),
    ]);

    console.log(result);

    return NextResponse.json(result);
  } catch (error) {
    console.warn("failed to tranlsate");
    console.error(error);
  }
}
