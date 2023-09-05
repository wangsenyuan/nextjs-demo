import { LangChainStream, StreamingTextResponse } from "ai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";

import { LLMChain } from "langchain/chains";

export const runtime = "edge";

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const last = messages.slice(-1)[0];

    // console.log(`${messages}`);
    console.log("handle request");

    const template =
      "You are a helpful assistant that translates {input_language} to {output_language}";
    const systemMessagePrompt =
      SystemMessagePromptTemplate.fromTemplate(template);

    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      systemMessagePrompt,
      HumanMessagePromptTemplate.fromTemplate("translate {text}"),
    ]);

    const chat = new ChatOpenAI({
      streaming: true,
      temperature: 0.3,
    });

    const chain = new LLMChain({
      llm: chat,
      prompt: chatPrompt,
    });

    const { stream, handlers } = LangChainStream();

    chain.call(
      {
        input_language: "English",
        output_language: "Chinese",
        text: last.content,
      },
      [handlers]
    );

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.warn("failed to tranlsate");
    console.error(error);
  }
}
