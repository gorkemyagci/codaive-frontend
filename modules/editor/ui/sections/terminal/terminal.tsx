"use client";
import { useEffect, useRef, useState } from "react";
import { Terminal as XTerm } from "xterm";
import "xterm/css/xterm.css";
import TerminalControls from "./terminal-controls";

const prompt = (term: XTerm, cwd: string) => {
  term.write(`\r\n${cwd} $ `);
};

const TerminalComponent = () => {
  const xtermRef = useRef<XTerm | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [cwd, setCwd] = useState("/home/user");
  const inputBuffer = useRef("");
  const cursorIndex = useRef(0);
  const commandHistory = useRef<string[]>([]);
  const historyIndex = useRef<number>(-1);

  useEffect(() => {
    if (!containerRef.current) return;
    const term = new XTerm({
      fontSize: 14,
      theme: { background: "#18181b", foreground: "#e4e4e7" },
      cursorBlink: true,
      fontFamily: 'Menlo, Monaco, "Liberation Mono", "Courier New", monospace',
      rows: 20
    });
    term.open(containerRef.current);
    term.writeln("Welcome to AI Terminal!");
    prompt(term, cwd);

    const redrawInput = () => {
      // Satırı temizle ve input buffer'ı tekrar yaz
      term.write(`\r${cwd} $ ${inputBuffer.current}`);
      // İmleci doğru yere getir
      const pos = inputBuffer.current.length - cursorIndex.current;
      if (pos > 0) term.write(`\x1b[${pos}D`);
    };

    term.onKey(({ key, domEvent }: { key: string; domEvent: KeyboardEvent }) => {
      if (domEvent.key === "Enter") {
        term.write("\r\n");
        const command = inputBuffer.current;
        commandHistory.current.push(command);
        historyIndex.current = -1;
        handleCommand(term, command);
        inputBuffer.current = "";
        cursorIndex.current = 0;
        prompt(term, cwd);
      } else if (domEvent.key === "Backspace") {
        if (cursorIndex.current < inputBuffer.current.length) {
          // İmleç ortadaysa
          inputBuffer.current =
            inputBuffer.current.slice(0, inputBuffer.current.length - cursorIndex.current - 1) +
            inputBuffer.current.slice(inputBuffer.current.length - cursorIndex.current);
          redrawInput();
        } else if (inputBuffer.current.length > 0) {
          // Sonda ise
          inputBuffer.current = inputBuffer.current.slice(0, -1);
          term.write("\b \b");
        }
      } else if (domEvent.key === "ArrowLeft") {
        if (cursorIndex.current < inputBuffer.current.length) {
          cursorIndex.current++;
          term.write("\x1b[D");
        }
      } else if (domEvent.key === "ArrowRight") {
        if (cursorIndex.current > 0) {
          cursorIndex.current--;
          term.write("\x1b[C");
        }
      } else if (domEvent.key === "ArrowUp") {
        if (commandHistory.current.length > 0) {
          if (historyIndex.current < commandHistory.current.length - 1) {
            historyIndex.current++;
            inputBuffer.current = commandHistory.current[commandHistory.current.length - 1 - historyIndex.current];
            cursorIndex.current = 0;
            redrawInput();
          }
        }
      } else if (domEvent.key === "ArrowDown") {
        if (historyIndex.current > 0) {
          historyIndex.current--;
          inputBuffer.current = commandHistory.current[commandHistory.current.length - 1 - historyIndex.current];
          cursorIndex.current = 0;
          redrawInput();
        } else if (historyIndex.current === 0) {
          historyIndex.current = -1;
          inputBuffer.current = "";
          cursorIndex.current = 0;
          redrawInput();
        }
      } else if (domEvent.key.length === 1 && !domEvent.ctrlKey && !domEvent.metaKey) {
        // Karakter ekle
        if (cursorIndex.current === 0) {
          inputBuffer.current += key;
          term.write(key);
        } else {
          // Ortada karakter ekle
          const pos = inputBuffer.current.length - cursorIndex.current;
          inputBuffer.current =
            inputBuffer.current.slice(0, pos) + key + inputBuffer.current.slice(pos);
          redrawInput();
        }
      }
    });

    xtermRef.current = term;
    return () => {
      term.dispose();
    };
  }, [cwd]);

  useEffect(() => {
    if (!containerRef.current || !xtermRef.current) return;

    const handleResize = () => {
      const container = containerRef.current!;
      const term = xtermRef.current!;
      // Her satırın px yüksekliği: fontSize * lineHeight (yaklaşık 1.2)
      const fontSize = 14;
      const lineHeight = 1.2;
      const rowHeight = fontSize * lineHeight;
      const rows = Math.floor(container.offsetHeight / rowHeight);
      const cols = Math.floor(container.offsetWidth / 8); // 8px: monospace char width approx
      if (rows > 0 && cols > 0) {
        term.resize(cols, rows);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Komutları simüle et
  const handleCommand = (term: XTerm, command: string) => {
    const [cmd, ...args] = command.trim().split(" ");
    switch (cmd) {
      case "ls":
        term.writeln("file1.txt  file2.js  folder/");
        break;
      case "cd":
        if (args[0]) setCwd(args[0]);
        break;
      case "clear":
        term.clear();
        break;
      case "echo":
        term.writeln(args.join(" "));
        break;
      case "console.log":
        term.writeln(args.join(" "));
        break;
      case "help":
        term.writeln("ls, cd <dir>, clear, echo <msg>, console.log <msg>, help");
        break;
      default:
        if (cmd) term.writeln(`Command not found: ${cmd}`);
    }
  };

  const handleClear = () => {
    xtermRef.current?.clear();
    if (xtermRef.current) prompt(xtermRef.current, cwd);
  };
  const handleCopy = () => {
    if (!xtermRef.current) return;
    // Get all lines from the active buffer
    const buffer = xtermRef.current.buffer.active;
    let text = "";
    for (let i = 0; i < buffer.length; i++) {
      text += buffer.getLine(i)?.translateToString() + "\n";
    }
    if (text) navigator.clipboard.writeText(text);
  };
  const handleNew = () => {
    if (xtermRef.current) {
      xtermRef.current.writeln("\r\n--- New Terminal ---\r\n");
      prompt(xtermRef.current, cwd);
    }
  };
  const handleTheme = () => {
    if (!xtermRef.current) return;
    // xterm.js public API'de theme'ı doğrudan değiştirmek için setOption yok, options property'sini güncelle:
    const currentBg = xtermRef.current.options.theme?.background;
    const isDark = currentBg === "#18181b";
    xtermRef.current.options.theme = isDark
      ? { background: "#f4f4f5", foreground: "#18181b" }
      : { background: "#18181b", foreground: "#e4e4e7" };
    xtermRef.current.refresh(0, xtermRef.current.rows - 1);
  };

  return (
    <div className="flex flex-col bg-background border-t min-h-0">
      <TerminalControls
        onClear={handleClear}
        onCopy={handleCopy}
        onNew={handleNew}
        onTheme={handleTheme}
      />
      <div
        ref={containerRef}
        className="flex-1 min-h-0"
      />
    </div>
  );
};

export default TerminalComponent;