import { LangChainStream, StreamingTextResponse } from "ai";
import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "langchain/prompts";

export const runtime = "edge";

const getCurrentDate = () => {
  return new Date().toISOString();
};

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const last = messages.slice(-1)[0];

    const message = HumanMessagePromptTemplate.fromTemplate(
      "Tell me a {adjective} joke about the day {date}"
    );

    const chatPrompt = ChatPromptTemplate.fromPromptMessages([message]);

    const chat = new ChatOpenAI({
      streaming: true,
      temperature: 0.5,
      verbose: true,
    });

    const chain = new LLMChain({
      llm: chat,
      prompt: chatPrompt,
    });

    const { stream, handlers } = LangChainStream();

    chain.call(
      {
        date: getCurrentDate,
        adjective: last.content,
      },
      [handlers]
    );

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.warn("has problem");
    console.error(error);
  }
}
