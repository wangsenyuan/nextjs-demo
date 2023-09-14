import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema";
import { NextResponse } from "next/server";

const extractionFunctionSchema = {
  name: "extractor",
  description: "Extracts fields from the input.",
  parameters: {
    type: "object",
    properties: {
      tone: {
        type: "string",
        enum: ["positive", "negative"],
        description: "The overall tone of the input",
      },
      word_count: {
        type: "number",
        description: "The number of words in the input",
      },
      chat_response: {
        type: "string",
        description: "A response to the human's input",
      },
    },
    required: ["tone", "word_count", "chat_response"],
  },
};

export async function POST(req) {
  try {
    console.log("api processing");
    // Bind function arguments to the model.
    // All subsequent invoke calls will use the bound parameters.
    // "functions.parameters" must be formatted as JSON Schema
    // Omit "function_call" if you want the model to choose a function to call.
    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
    }).bind({
      functions: [extractionFunctionSchema],
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
