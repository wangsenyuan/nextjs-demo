import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferMemory } from "langchain/memory";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req) {
  try {
    const chat = new ChatOpenAI({ temperature: 0 });

    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know."
      ),
      new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate("{input}"),
    ]);

    // Return the current conversation directly as messages and insert them into the MessagesPlaceholder in the above prompt.
    const memory = new BufferMemory({
      returnMessages: true,
      memoryKey: "history",
    });

    const chain = new ConversationChain({
      memory,
      prompt: chatPrompt,
      llm: chat,
      verbose: true,
    });

    const res1 = await chain.call({
      input: "My name is Jim.",
    });

    const res2 = await chain.call({
      input: "What is my name?",
    });

    console.log("get result from chat-gpt");

    return NextResponse.json({ res1, res2 });
  } catch (error) {
    console.warn("has problem");
    console.error(error);
  }
}
