import { NextRequest, NextResponse } from "next/server";

import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";

export const POST = async (req: NextRequest) => {
  const { message: inputMessage } = await req.json();

  const promptTemplate = PromptTemplate.fromTemplate("{message}");

  const model = new ChatOpenAI({
    model: "gpt-4o",
  });

  const parser = new StringOutputParser();

  const chain = promptTemplate.pipe(model).pipe(parser);

  const responseMessage = await chain.invoke({ message: inputMessage });

  return NextResponse.json({ message: responseMessage });
};
