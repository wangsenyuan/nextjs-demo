import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req) {
  try {
    const executor = await initializeAgentExecutorWithOptions(
      [new Calculator(), new SerpAPI()],
      new ChatOpenAI({ modelName: "gpt-3.5-turbo", temperature: 0 }),
      {
        agentType: "openai-functions",
        verbose: true,
      }
    );

    const result = await executor.run("What is the temperature in New York?");

    console.log(JSON.stringify(result));

    return NextResponse.json({result});
  } catch (error) {
    console.error(error);
  }
}
