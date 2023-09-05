import { LangChainStream, StreamingTextResponse } from "ai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { AIMessage, HumanMessage, SystemMessage } from "langchain/schema";

export const runtime = "edge";

export async function POST(req) {
  try {
    const { messages } = await req.json();

    // console.log(`${messages}`);
    console.log("handle request");

    const template =
      "You are a helpful assistant that translates English to Chinese, and translate all my following inputs into Chinese;";

    const sysMessage = new SystemMessage(template);

    const { stream, handlers } = LangChainStream();

    const llm = new ChatOpenAI({
      streaming: true,
    });

    const msgs = [
      sysMessage,
      ...messages.map((m) =>
        m.role == "user"
          ? new HumanMessage(m.content)
          : new AIMessage(m.content)
      ),
    ];

    llm.call(msgs, {}, [handlers]).catch(console.error);

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
  }
}
