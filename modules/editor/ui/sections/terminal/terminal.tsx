"use client";
import { useEffect, useRef, useState } from "react";
import { Terminal as XTerm } from "xterm";
import "xterm/css/xterm.css";
import TerminalControls from "./terminal-controls";
import { NodeType } from "@/lib/types";

const scrollbarStyle = `
  .xterm .xterm-viewport::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  .xterm .xterm-viewport::-webkit-scrollbar-thumb {
    background: #3f3f46;
    border-radius: 5px;
  }
  .xterm .xterm-viewport::-webkit-scrollbar-track {
    background: #27272a;
  }
  .xterm .xterm-viewport {
    scrollbar-width: thin;
    scrollbar-color: #3f3f46 #27272a;
  }
`;

const prompt = (term: XTerm, cwd: string) => {
  term.write(`\r\n${cwd} $ `);
};

class InputBuffer {
  lines: string[];
  cursorRow: number;
  cursorCol: number;
  constructor() {
    this.lines = [""];
    this.cursorRow = 0;
    this.cursorCol = 0;
  }
  get value() {
    return this.lines.join("\n");
  }
  insert(char: string) {
    const line = this.lines[this.cursorRow];
    this.lines[this.cursorRow] =
      line.slice(0, this.cursorCol) + char + line.slice(this.cursorCol);
    this.cursorCol++;
  }
  backspace() {
    if (this.cursorCol > 0) {
      const line = this.lines[this.cursorRow];
      this.lines[this.cursorRow] =
        line.slice(0, this.cursorCol - 1) + line.slice(this.cursorCol);
      this.cursorCol--;
    } else if (this.cursorRow > 0) {
      const prevLine = this.lines[this.cursorRow - 1];
      const currLine = this.lines[this.cursorRow];
      this.cursorCol = prevLine.length;
      this.lines[this.cursorRow - 1] = prevLine + currLine;
      this.lines.splice(this.cursorRow, 1);
      this.cursorRow--;
    }
  }
  delete() {
    const line = this.lines[this.cursorRow];
    if (this.cursorCol < line.length) {
      this.lines[this.cursorRow] =
        line.slice(0, this.cursorCol) + line.slice(this.cursorCol + 1);
    } else if (this.cursorRow < this.lines.length - 1) {
      this.lines[this.cursorRow] += this.lines[this.cursorRow + 1];
      this.lines.splice(this.cursorRow + 1, 1);
    }
  }
  moveLeft() {
    if (this.cursorCol > 0) {
      this.cursorCol--;
    } else if (this.cursorRow > 0) {
      this.cursorRow--;
      this.cursorCol = this.lines[this.cursorRow].length;
    }
  }
  moveRight() {
    const line = this.lines[this.cursorRow];
    if (this.cursorCol < line.length) {
      this.cursorCol++;
    } else if (this.cursorRow < this.lines.length - 1) {
      this.cursorRow++;
      this.cursorCol = 0;
    }
  }
  moveUp() {
    if (this.cursorRow > 0) {
      this.cursorRow--;
      this.cursorCol = Math.min(this.cursorCol, this.lines[this.cursorRow].length);
    }
  }
  moveDown() {
    if (this.cursorRow < this.lines.length - 1) {
      this.cursorRow++;
      this.cursorCol = Math.min(this.cursorCol, this.lines[this.cursorRow].length);
    }
  }
  moveHome() {
    this.cursorCol = 0;
  }
  moveEnd() {
    this.cursorCol = this.lines[this.cursorRow].length;
  }
  insertNewline() {
    const line = this.lines[this.cursorRow];
    const before = line.slice(0, this.cursorCol);
    const after = line.slice(this.cursorCol);
    this.lines[this.cursorRow] = before;
    this.lines.splice(this.cursorRow + 1, 0, after);
    this.cursorRow++;
    this.cursorCol = 0;
  }
}

interface TerminalComponentProps {
  tree: NodeType[];
  setTree: React.Dispatch<React.SetStateAction<NodeType[]>>;
  terminalRef?: React.MutableRefObject<XTerm | null>;
}

const TerminalComponent = ({ tree, setTree, terminalRef }: TerminalComponentProps) => {
  const xtermRef = useRef<XTerm | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [cwd, setCwd] = useState("/");
  const inputBuffer = useRef(new InputBuffer());
  const commandHistory = useRef<string[]>([]);
  const historyIndex = useRef<number>(-1);
  const treeRef = useRef(tree);

  useEffect(() => {
    treeRef.current = tree;
  }, [tree]);

  function getCwdNode(): NodeType | null {
    if (cwd === "/") return null;
    return treeRef.current.find((n) => n.type === "folder" && n.name === cwd.replace(/^\//, "")) || null;
  }

  function findNodeByPath(path: string, nodes: NodeType[]): NodeType | null {
    const name = path.split("/").filter(Boolean)[0];
    if (!name) return null;
    return nodes.find((n) => n.name === name) || null;
  }

  function updateTreeAtPath(path: string, updater: (node: NodeType) => NodeType) {
    const name = path.split("/").filter(Boolean)[0];
    if (!name) {
      setTree((prev) => prev.map(updater));
      return;
    }
    setTree((prev) => prev.map((node) => node.name === name ? updater(node) : node));
  }

  useEffect(() => {
    if (!containerRef.current) return;

    const styleElement = document.createElement('style');
    styleElement.textContent = scrollbarStyle;
    document.head.appendChild(styleElement);

    const fontSize = 14;
    const lineHeight = 1.2;
    const rowHeight = fontSize * lineHeight;
    const rows = Math.floor((window.innerHeight * 0.38) / rowHeight);
    const term = new XTerm({
      fontSize,
      theme: { background: "#18181b", foreground: "#e4e4e7" },
      cursorBlink: true,
      fontFamily: 'Menlo, Monaco, "Liberation Mono", "Courier New", monospace',
      rows,
    });
    term.open(containerRef.current);
    term.writeln("Welcome to Codaive Terminal");
    prompt(term, cwd);

    term.attachCustomKeyEventHandler((e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") return true;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c" && term.hasSelection()) return true;
      return true;
    });

    const handlePaste = (event: ClipboardEvent) => {
      if (!xtermRef.current) return;
      const text = event.clipboardData?.getData("text");
      if (text) {
        for (const char of text) {
          inputBuffer.current.insert(char);
        }
        redrawInput();
        event.preventDefault();
      }
    };

    containerRef.current.addEventListener("paste", handlePaste);

    const redrawInput = () => {
      term.write("\r\x1b[K");
      term.write(`${cwd} $ `);
      inputBuffer.current.lines.forEach((line, i) => {
        if (i > 0) term.write("\n");
        term.write(line);
      });
      const totalLines = inputBuffer.current.lines.length;
      const row = inputBuffer.current.cursorRow;
      const col = inputBuffer.current.cursorCol;
      if (totalLines - row - 1 > 0) term.write(`\x1b[${totalLines - row - 1}A`);
      term.write(`\r${cwd} $ ` + inputBuffer.current.lines[row].slice(0, col));
    };

    term.onKey(({ key, domEvent }: { key: string; domEvent: KeyboardEvent }) => {
      if (domEvent.ctrlKey && domEvent.key === "a") {
        inputBuffer.current.moveHome();
        redrawInput();
      } else if (domEvent.ctrlKey && domEvent.key === "e") {
        inputBuffer.current.moveEnd();
        redrawInput();
      } else if (domEvent.key === "ArrowLeft") {
        inputBuffer.current.moveLeft();
        redrawInput();
      } else if (domEvent.key === "ArrowRight") {
        inputBuffer.current.moveRight();
        redrawInput();
      } else if (domEvent.key === "ArrowUp") {
        inputBuffer.current.moveUp();
        redrawInput();
      } else if (domEvent.key === "ArrowDown") {
        inputBuffer.current.moveDown();
        redrawInput();
      } else if (domEvent.key === "Home") {
        inputBuffer.current.moveHome();
        redrawInput();
      } else if (domEvent.key === "End") {
        inputBuffer.current.moveEnd();
        redrawInput();
      } else if (domEvent.key === "Backspace") {
        inputBuffer.current.backspace();
        redrawInput();
      } else if (domEvent.key === "Delete") {
        inputBuffer.current.delete();
        redrawInput();
      } else if (domEvent.key === "Tab") {
        const currentInput = inputBuffer.current.value;
        const parts = currentInput.split(" ");

        if (parts[0] === "cd" && parts.length === 2 && parts[1].length > 0) {
          const prefix = parts[1];
          const cwdNode = getCwdNode();

          if (cwdNode && cwdNode.type === "folder" && cwdNode.children) {
            const matches = cwdNode.children
              .filter(n => n.type === "folder" && n.name.startsWith(prefix))
              .map(n => n.name);

            if (matches.length === 1) {
              const newInput = `cd ${matches[0]}`;
              inputBuffer.current = new InputBuffer();
              for (const char of newInput) {
                inputBuffer.current.insert(char);
              }
              redrawInput();
            }
            else if (matches.length > 1) {
              let commonPrefix = matches[0];
              for (let i = 1; i < matches.length; i++) {
                commonPrefix = findCommonPrefix(commonPrefix, matches[i]);
              }

              if (commonPrefix.length > prefix.length) {
                const newInput = `cd ${commonPrefix}`;
                inputBuffer.current = new InputBuffer();
                for (const char of newInput) {
                  inputBuffer.current.insert(char);
                }
                redrawInput();
              } else {
                term.writeln("\r\n" + matches.join("  "));
                prompt(term, cwd);
                redrawInput();
              }
            }
          }
        }
        domEvent.preventDefault();
      } else if (domEvent.key === "Enter") {
        if (domEvent.shiftKey) {
          inputBuffer.current.insertNewline();
          redrawInput();
        } else {
          const command = inputBuffer.current.value;
          commandHistory.current.push(command);
          historyIndex.current = -1;
          term.write("\r\n");
          handleCommand(term, command);
          inputBuffer.current = new InputBuffer();
          prompt(term, cwd);
        }
      } else if (domEvent.key.length === 1 && !domEvent.ctrlKey && !domEvent.metaKey) {
        inputBuffer.current.insert(key);
        redrawInput();
      }
    });

    xtermRef.current = term;
    if (terminalRef) {
      terminalRef.current = term;
    }

    return () => {
      term.dispose();
      containerRef.current?.removeEventListener("paste", handlePaste);
      if (terminalRef) {
        terminalRef.current = null;
      }
      styleElement.remove();
    };
  }, [cwd, terminalRef]);

  useEffect(() => {
    if (!containerRef.current || !xtermRef.current) return;

    const handleResize = () => {
      const container = containerRef.current!;
      const term = xtermRef.current!;
      const fontSize = 14;
      const lineHeight = 1.2;
      const rowHeight = fontSize * lineHeight;
      const rows = Math.floor(container.offsetHeight / rowHeight);
      const cols = Math.floor(container.offsetWidth / 8);
      if (rows > 0 && cols > 0) {
        term.resize(cols, rows);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCommand = (term: XTerm, command: string) => {
    const [cmd, ...args] = command.trim().split(/\s+/);
    const cwdNode = getCwdNode();
    switch (cmd) {
      case "ls": {
        if (cwd === "/") {
          term.writeln(treeRef.current.map((n) => n.name + (n.type === "folder" ? "/" : "")).join("  ") || "");
        } else if (cwdNode && cwdNode.type === "folder" && cwdNode.children) {
          term.writeln(cwdNode.children.map((n) => n.name + (n.type === "folder" ? "/" : "")).join("  ") || "");
        } else {
          term.writeln("Not a directory");
        }
        break;
      }
      case "cd": {
        const target = args[0] || "/";
        if (target === ".." || target === "/") {
          if (cwd === "/" || target === "/") {
            setCwd("/");
          } else {
            const parentPath = cwd.split("/").slice(0, -1).filter(Boolean).join("/");
            setCwd(parentPath ? "/" + parentPath : "/");
          }
          break;
        }
        if (cwd === "/") {
          const node = treeRef.current.find((n) => n.type === "folder" && n.name === target.replace(/^\//, ""));
          if (node) {
            setCwd("/" + node.name);
          } else {
            term.writeln("No such directory: " + target);
          }
        } else if (cwdNode && cwdNode.type === "folder" && cwdNode.children) {
          const node = cwdNode.children.find((n) => n.type === "folder" && n.name === target.replace(/^\//, ""));
          if (node) {
            setCwd(cwd + "/" + node.name);
          } else {
            term.writeln("No such directory: " + target);
          }
        } else {
          term.writeln("No such directory: " + target);
        }
        break;
      }
      case "mkdir": {
        const name = args[0];
        if (!name) return term.writeln("Usage: mkdir <folder>");
        if (cwd === "/") {
          if (treeRef.current.some((n) => n.name === name)) return term.writeln("File or folder exists");
          setTree((prev) => [...prev, { id: Math.random().toString(36), name, type: "folder", children: [] }]);
        } else if (cwdNode && cwdNode.type === "folder") {
          if (cwdNode.children?.some((n) => n.name === name)) return term.writeln("File or folder exists");
          updateTreeAtPath(cwd, (node) => {
            if (node.type !== "folder") return node;
            return {
              ...node,
              children: [...(node.children || []), { id: Math.random().toString(36), name, type: "folder", children: [] }],
            };
          });
        } else {
          return term.writeln("Not a directory");
        }
        setTimeout(() => prompt(term, cwd), 0);
        break;
      }
      case "touch": {
        const name = args[0];
        if (!name) return term.writeln("Usage: touch <file>");
        if (cwd === "/") {
          if (treeRef.current.some((n) => n.name === name)) return term.writeln("File or folder exists");
          setTree((prev) => [...prev, { id: Math.random().toString(36), name, type: "file" }]);
        } else if (cwdNode && cwdNode.type === "folder") {
          if (cwdNode.children?.some((n) => n.name === name)) return term.writeln("File or folder exists");
          updateTreeAtPath(cwd, (node) => {
            if (node.type !== "folder") return node;
            return {
              ...node,
              children: [...(node.children || []), { id: Math.random().toString(36), name, type: "file" }],
            };
          });
        } else {
          return term.writeln("Not a directory");
        }
        setTimeout(() => prompt(term, cwd), 0);
        break;
      }
      case "rm": {
        const name = args[0];
        if (!name) return term.writeln("Usage: rm <file|folder>");
        if (cwd === "/") {
          setTree((prev) => prev.filter((n) => n.name !== name));
        } else if (cwdNode && cwdNode.type === "folder") {
          updateTreeAtPath(cwd, (node) => {
            if (node.type !== "folder") return node;
            return {
              ...node,
              children: (node.children || []).filter((n) => n.name !== name),
            };
          });
        } else {
          return term.writeln("Not a directory");
        }
        setTimeout(() => prompt(term, cwd), 0);
        break;
      }
      case "cat": {
        const name = args[0];
        if (!name) return term.writeln("Usage: cat <file>");
        let file = null;
        if (cwd === "/") {
          file = treeRef.current.find((n) => n.name === name && n.type === "file");
        } else if (cwdNode && cwdNode.type === "folder" && cwdNode.children) {
          file = cwdNode.children.find((n) => n.name === name && n.type === "file");
        }
        if (file) {
          term.writeln(`(empty)`);
        } else {
          term.writeln("No such file: " + name);
        }
        break;
      }
      case "echo": {
        term.writeln(args.join(" "));
        break;
      }
      case "clear": {
        term.clear();
        break;
      }
      case "help": {
        term.writeln("Available commands: ls, cd, mkdir, touch, rm, cat, echo, clear, help");
        break;
      }
      default: {
        if (cmd) term.writeln(`Command not found: ${cmd}`);
      }
    }
  };

  const handleClear = () => {
    xtermRef.current?.clear();
    if (xtermRef.current) prompt(xtermRef.current, cwd);
  };
  const handleCopy = () => {
    if (!xtermRef.current) return;

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
    const currentBg = xtermRef.current.options.theme?.background;
    const isDark = currentBg === "#18181b";
    xtermRef.current.options.theme = isDark
      ? { background: "#f4f4f5", foreground: "#18181b" }
      : { background: "#18181b", foreground: "#e4e4e7" };
    xtermRef.current.refresh(0, xtermRef.current.rows - 1);
  };

  function findCommonPrefix(a: string, b: string): string {
    let i = 0;
    while (i < a.length && i < b.length && a[i] === b[i]) {
      i++;
    }
    return a.substring(0, i);
  }

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