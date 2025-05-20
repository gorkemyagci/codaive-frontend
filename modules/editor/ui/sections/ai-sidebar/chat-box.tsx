"use client";
import { useEffect, useRef, useState } from "react";

const mockMessages = [
  { role: "user", content: "Explain this code." },
  { role: "ai", content: "Sure! This code defines a React component..." },
  { role: "user", content: "Add TypeScript types." },
  { role: "ai", content: "Absolutely! Here is how you can add types..." },
];

function useTypewriter(text: string, speed = 18) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text[i]);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return displayed;
}

const ChatBox = () => {
  const ref = useRef<HTMLDivElement>(null);
  const lastMsg = mockMessages[mockMessages.length - 1];
  const isLastAi = lastMsg.role === "ai";
  const typewriter = useTypewriter(isLastAi ? lastMsg.content : "");
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [typewriter]);
  return (
    <div className="flex-1 overflow-y-auto px-2 py-2 bg-zinc-900/70 no-scrollbar">
      {mockMessages.slice(0, isLastAi ? -1 : undefined).map((msg, i) => (
        <div key={i} className={`flex items-end ${msg.role === "user" ? "justify-end" : "justify-start"} mb-1.5`}>
          <div
            className={`max-w-[80%] px-3 py-1.5 rounded-2xl text-xs shadow-sm mx-1
              ${msg.role === "user"
                ? "bg-blue-600 text-white rounded-br-md"
                : "bg-zinc-800 text-zinc-100 rounded-bl-md border border-zinc-800"}
            `}
            style={{ lineHeight: 1.5 }}
          >
            {msg.content}
          </div>
        </div>
      ))}
      {isLastAi && (
        <div className="flex items-end mb-1.5 justify-start">
          <div className="max-w-[80%] px-3 py-1.5 rounded-2xl text-xs shadow-sm mx-1 bg-zinc-800 text-zinc-100 rounded-bl-md border border-zinc-800 animate-pulse" style={{ lineHeight: 1.5 }}>
            {typewriter}
          </div>
        </div>
      )}
      {mockMessages.length === 0 && (
        <div className="text-zinc-500 text-xs flex items-center justify-center h-10 italic">Start a conversation with AI...</div>
      )}
    </div>
  );
};
export default ChatBox;