"use client";

import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import axios from "axios";
import { LoaderCircle, Send } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";

import { v4 as uuidv4 } from "uuid";

const Chat = () => {
  const [messages, setMessages] = useState<
    { role: "bot" | "user"; content: string }[]
  >([]);
  const [inputMessage, setInputMessage] = useState("");
  const [responseLoading, setResponseLoading] = useState(false);
  const [sessionId] = useState(uuidv4());

  const sendMessage = () => {
    if (!inputMessage) return;
    setResponseLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: inputMessage },
    ]);
    axios
      .post(`/api/chat`, { message: inputMessage, sessionId: sessionId })
      .then((res) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "bot", content: res.data.message },
        ]);
        setInputMessage("");
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setResponseLoading(false);
      });
  };

  return (
    <div className="h-screen max-w-screen-xl m-auto px-4 py-6 flex flex-col gap-8">
      <div className="flex flex-col">
        <div className="text-2xl font-bold">Chat</div>
        <div className="text-md">
          Chat Template + LLM + Output Parser + Chat History
        </div>
      </div>
      <hr />
      <div className="flex-1 overflow-auto flex flex-col gap-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              message.role === "user"
                ? "bg-slate-100 self-end"
                : "bg-slate-200 self-start",
              "px-4 py-2",
              "rounded",
              "w-max max-w-screen-lg",
              "border"
            )}
          >
            <Markdown>{message.content}</Markdown>
          </div>
        ))}
      </div>
      <div className="w-full flex gap-4">
        <Input
          placeholder="Enter a message"
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && sendMessage()}
          value={inputMessage}
        />
        <Button
          onClick={sendMessage}
          disabled={!inputMessage || responseLoading}
        >
          {responseLoading ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </Button>
      </div>
    </div>
  );
};

export default Chat;
