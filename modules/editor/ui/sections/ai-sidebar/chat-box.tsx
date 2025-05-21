"use client";
import { useEffect, useRef, useState } from "react";

export interface Message {
  role: "user" | "ai";
  content: string;
}

interface ChatBoxProps {
  messages: Message[];
  isLoading: boolean;
}

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

const ChatBox = ({ messages, isLoading }: ChatBoxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;
  const isLastAi = lastMsg?.role === "ai";
  const typewriter = useTypewriter(isLastAi && isLoading ? lastMsg.content : "");
  
  const [loadingDots, setLoadingDots] = useState("");
  useEffect(() => {
    if (!isLoading || isLastAi) return;
    
    const interval = setInterval(() => {
      setLoadingDots(prev => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 400);
    
    return () => clearInterval(interval);
  }, [isLoading, isLastAi]);
  
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [typewriter, messages, loadingDots]);
  
  return (
    <div ref={ref} className="flex-1 overflow-y-auto px-2 py-2 bg-zinc-900/70 no-scrollbar">
      {messages.slice(0, isLastAi && isLoading ? -1 : undefined).map((msg, i) => (
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
      
      {isLastAi && isLoading && (
        <div className="flex items-end mb-1.5 justify-start">
          <div className="max-w-[80%] px-3 py-1.5 rounded-2xl text-xs shadow-sm mx-1 bg-zinc-800 text-zinc-100 rounded-bl-md border border-zinc-800 animate-pulse" style={{ lineHeight: 1.5 }}>
            {typewriter}
          </div>
        </div>
      )}
      
      {isLoading && !isLastAi && messages.length > 0 && (
        <div className="flex items-end mb-1.5 justify-start">
          <div className="max-w-[80%] px-3 py-1.5 rounded-2xl text-xs shadow-sm mx-1 bg-zinc-800/70 text-zinc-400 rounded-bl-md border border-zinc-700 animate-pulse" style={{ lineHeight: 1.5 }}>
            <div className="flex items-center gap-1">
              <div className="size-2 bg-blue-400 rounded-full opacity-75"></div>
              <div className="size-2 bg-blue-400 rounded-full opacity-75 animate-pulse delay-100"></div>
              <div className="size-2 bg-blue-400 rounded-full opacity-75 animate-pulse delay-200"></div>
              <span className="ml-2">AI is thinking{loadingDots}</span>
            </div>
          </div>
        </div>
      )}
      
      {messages.length === 0 && (
        <div className="text-zinc-500 text-xs flex items-center justify-center h-10 italic">Start a conversation with AI...</div>
      )}
    </div>
  );
};

export default ChatBox;