"use client"
import Navbar from "../components/navbar";
import FileExplorer from "../sections/file-explorer";
import CodeEditor from "../sections/code-editor";
import ChatBox from "../sections/ai-sidebar/chat-box";
import CommandInput from "../sections/ai-sidebar/command-input";
import ModalSelector from "../sections/ai-sidebar/modal-selector";
import SuggestionList from "../sections/ai-sidebar/suggestion-list";
import { ResizableView } from "@/components/resizable-view";
import TerminalComponent from "../sections/terminal/terminal";
import { useState } from "react";
import { NodeType } from "@/lib/types";

const EditorView = () => {
    const [tree, setTree] = useState<NodeType[]>([
        {
            id: "codaive-root",
            name: "codaive-web",
            type: "folder",
            children: []
        }
    ]);
    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 min-h-0 overflow-hidden flex-row">
                <ResizableView min={180} max={400} initial={240} side="right">
                    <FileExplorer tree={tree} setTree={setTree} />
                </ResizableView>
                <div className="flex-1 min-w-0 flex flex-col">
                    <CodeEditor />
                    <ResizableView min={100} max={400} initial={120} direction="vertical">
                        <TerminalComponent tree={tree} setTree={setTree} />
                    </ResizableView>
                </div>
                <ResizableView min={260} max={480} initial={320} side="left" className="bg-zinc-900/90">
                    <div className="flex-1 overflow-y-auto">
                        <ModalSelector />
                        <ChatBox />
                        <SuggestionList />
                    </div>
                    <div className="border-t p-2">
                        <CommandInput />
                    </div>
                </ResizableView>
            </div>
        </div>
    );
};

export default EditorView;