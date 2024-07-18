"use client";

import { Button, Input } from "@/components/ui";
import axios from "axios";
import { LoaderCircle, Send } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
import { PAGES } from "../constants";
import { usePathname } from "next/navigation";

const Basic = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [responseLoading, setResponseLoading] = useState(false);

  const pathname = usePathname();
  const page = PAGES.find((p) => p.path === pathname);

  const sendMessage = () => {
    if (!inputMessage) return;
    setResponseLoading(true);
    axios
      .post(`/api/basic`, { message: inputMessage })
      .then((res) => {
        setResponseMessage(res.data.message);
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
        <div className="text-2xl font-bold">{page?.title}</div>
        <div className="text-md">{page?.description}</div>
      </div>
      <hr />
      <Markdown className="flex-1 overflow-auto">{responseMessage}</Markdown>
      <div className="w-full flex gap-4">
        <Input
          placeholder="Ask anything..!"
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && sendMessage()}
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

export default Basic;
