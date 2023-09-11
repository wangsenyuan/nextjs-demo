import { OpenAIStream, StreamingTextResponse } from "ai";
import { PipelinePromptTemplate, PromptTemplate } from "langchain/prompts";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req) {
  try {
    const fullPrompt = PromptTemplate.fromTemplate(`{introduction}

{example}

{start}`);

    const introductionPrompt = PromptTemplate.fromTemplate(
      `You are impersonating {person}.`
    );

    const examplePrompt =
      PromptTemplate.fromTemplate(`Here's an example of an interaction:
Q: {example_q}
A: {example_a}`);

    const startPrompt = PromptTemplate.fromTemplate(`Now, do this for real!
Q: {input}
A:`);

    const composedPrompt = new PipelinePromptTemplate({
      pipelinePrompts: [
        {
          name: "introduction",
          prompt: introductionPrompt,
        },
        {
          name: "example",
          prompt: examplePrompt,
        },
        {
          name: "start",
          prompt: startPrompt,
        },
      ],
      finalPrompt: fullPrompt,
    });

    const { messages } = await req.json();
    const last = messages.slice(-1)[0];

    const formattedPrompt = await composedPrompt.format({
      person: "Elon Musk",
      example_q: `What's your favorite car?`,
      example_a: "Telsa",
      input: last.content,
    });

    console.log(formattedPrompt);

    console.log("call chatgpt");

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [{ role: "user", content: formattedPrompt }],
    });
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
  }
}
