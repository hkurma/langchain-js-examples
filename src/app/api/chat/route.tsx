import { NextRequest, NextResponse } from "next/server";

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";

const chatHistory: Record<string, InMemoryChatMessageHistory> = {};

export const POST = async (req: NextRequest) => {
  const { message: inputMessage, sessionId } = await req.json();

  const systemMessage = "You are a helpful assistant.";

  const chatPromptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemMessage],
    ["placeholder", "{chat_history}"],
    ["human", "{input}"],
  ]);

  const model = new ChatOpenAI({
    model: "gpt-4o",
  });

  const parser = new StringOutputParser();

  let chain = chatPromptTemplate.pipe(model).pipe(parser);

  chain = new RunnableWithMessageHistory({
    runnable: chain,
    getMessageHistory: (sessionId) => {
      if (!chatHistory[sessionId])
        chatHistory[sessionId] = new InMemoryChatMessageHistory();
      return chatHistory[sessionId];
    },
    inputMessagesKey: "input",
    historyMessagesKey: "chat_history",
  });

  const responseMessage = await chain.invoke(
    { input: inputMessage },
    { configurable: { sessionId: sessionId } }
  );

  return NextResponse.json({ message: responseMessage });
};
