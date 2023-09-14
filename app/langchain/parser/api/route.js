import { ChatOpenAI } from "langchain/chat_models/openai";

import { BytesOutputParser } from "langchain/schema/output_parser";

export const runtime = "edge";

export async function GET(req) {
  try {
    console.log("handle request in parser api");
    const parser = new BytesOutputParser();

    const model = new ChatOpenAI({ temperature: 0 });

    const stream = await model.pipe(parser).stream("Hello there!");

    const decoder = new TextDecoder();

    async function* makeIterator(stream) {
      for await (const chunk of stream) {
        console.log("get chunk from stream");
        if (chunk) {
          const text = decoder.decode(chunk);
          console.log(`got chunk ${text}`);
          yield text;
        }
      }
    }

    return new Response(iteratorToStream(makeIterator(stream)));
  } catch (error) {
    console.warn("has problem");
    console.error(error);
  }
}

function iteratorToStream(iterator) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}
