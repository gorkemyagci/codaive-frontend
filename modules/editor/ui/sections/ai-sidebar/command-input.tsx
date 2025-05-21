"use client";
import { useRef, useState } from "react";
import { Forward, Paperclip } from "lucide-react";
import { Message } from "./chat-box";

const commands = ["/analyze", "/commit", "/test"];

function getCurrentWord(value: string, selectionStart: number) {
  const left = value.slice(0, selectionStart);
  const right = value.slice(selectionStart);
  const leftMatch = left.match(/[^\s]*$/)?.[0] || "";
  const rightMatch = right.match(/^[^\s]*/)?.[0] || "";
  const word = leftMatch + rightMatch;
  const wordStart = selectionStart - leftMatch.length;
  const wordEnd = selectionStart + rightMatch.length;
  return { word, wordStart, wordEnd };
}

interface CommandInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const CommandInput = ({ onSendMessage, isLoading }: CommandInputProps) => {
  const [value, setValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selected, setSelected] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectionStart = textareaRef.current?.selectionStart ?? value.length;
  const { word, wordStart, wordEnd } = getCurrentWord(value, selectionStart);

  const filtered = word.startsWith("/") && word.length > 1
    ? commands.filter(cmd => cmd.startsWith(word))
    : [];
  const bestSuggestion = filtered.length > 0 ? filtered[selected] : "";
  const ghostText = bestSuggestion && word && bestSuggestion.startsWith(word)
    ? bestSuggestion.slice(word.length)
    : "";

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    setShowSuggestions(() => {
      const caret = e.target.selectionStart;
      const { word } = getCurrentWord(e.target.value, caret);
      return word.startsWith("/") && word.length > 1 && commands.some(cmd => cmd.startsWith(word));
    });
    setSelected(0);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (ghostText) {
      if (e.key === "Tab" || (e.key === "Enter" && showSuggestions)) {
        e.preventDefault();
        const before = value.slice(0, wordStart);
        const after = value.slice(wordEnd);
        const completed = bestSuggestion;
        const newValue = before + completed + after;
        setValue(newValue);
        setShowSuggestions(false);
        setTimeout(() => {
          const caretPos = before.length + completed.length;
          textareaRef.current?.setSelectionRange(caretPos, caretPos);
        }, 0);
        return;
      }
    }
    if (showSuggestions && filtered.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((prev) => (prev + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((prev) => (prev - 1 + filtered.length) % filtered.length);
      }
    }
    if (e.key === "Enter" && !e.shiftKey && !showSuggestions) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (value.trim() && !isLoading) {
      onSendMessage(value);
      setValue("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const getGhostTextSpan = () => {
    if (!ghostText) return null;
    const beforeCaret = value.slice(0, selectionStart);
    const lines = beforeCaret.split("\n");
    const caretLineNumber = lines.length - 1;
    const caretLineStart = beforeCaret.lastIndexOf("\n") + 1;
    const caretInLine = selectionStart - caretLineStart;
    const allLines = value.split("\n");
    const lineText = allLines[caretLineNumber] || "";
    const beforeWordInLine = lineText.slice(0, caretInLine - (word.length - (selectionStart - wordEnd)));
    const wordInLine = word;
    const afterWordInLine = lineText.slice(caretInLine);
    let lineHeight = 22;
    let paddingTop = 0;
    if (textareaRef.current) {
      const style = window.getComputedStyle(textareaRef.current);
      lineHeight = parseFloat(style.lineHeight) || 22;
      paddingTop = parseFloat(style.paddingTop) || 0;
    }
    const top = paddingTop + caretLineNumber * lineHeight - 2;
    return (
      <span
        className="absolute left-0 pointer-events-none select-none text-zinc-400/60 italic"
        style={{ zIndex: 1, userSelect: "none", top }}
      >
        <span className="invisible">{beforeWordInLine}</span>
        <span className="invisible">{wordInLine}</span>
        <span>{ghostText}</span>
        <span className="invisible">{afterWordInLine}</span>
      </span>
    );
  };

  return (
    <div className="px-2 pb-2 pt-1">
      <div className="flex items-center mb-1">
        <button type="button" className="flex mb-1 items-center gap-1 text-xs text-zinc-400 hover:text-blue-500 px-1 py-1 rounded transition">
          <Paperclip className="w-4 h-4" />
          <span>Add file or image</span>
        </button>
      </div>
      <div className="relative flex items-end bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 focus-within:border-blue-500 transition">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            rows={1}
            className="w-full resize-none bg-transparent outline-none text-sm text-zinc-100 placeholder:text-zinc-500 pr-10 min-h-[24px] max-h-32"
            placeholder="/analyze, /commit, /test ... or message"
            autoComplete="off"
            spellCheck={false}
            style={{ zIndex: 2, background: "transparent", overflow: "hidden" }}
            disabled={isLoading}
          />
          {getGhostTextSpan()}
        </div>
        <button
          type="button"
          className={`ml-2 p-2 rounded-full flex items-center justify-center shadow transition ${
            isLoading 
              ? "bg-gray-600 cursor-not-allowed text-gray-300" 
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
          onClick={handleSendMessage}
          tabIndex={0}
          aria-label="Send"
          disabled={isLoading}
        >
          <Forward className="size-4" />
        </button>
      </div>
    </div>
  );
};
export default CommandInput;