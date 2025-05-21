"use client"
import Navbar from "../components/navbar";
import FileExplorer from "../sections/file-explorer";
import CodeEditor from "../sections/code-editor";
import ChatBox, { Message } from "../sections/ai-sidebar/chat-box";
import CommandInput from "../sections/ai-sidebar/command-input";
import ModalSelector from "../sections/ai-sidebar/modal-selector";
import SuggestionList from "../sections/ai-sidebar/suggestion-list";
import { ResizableView } from "@/components/resizable-view";
import TerminalComponent from "../sections/terminal/terminal";
import { useState, useRef, useCallback } from "react";
import { NodeType } from "@/lib/types";
import { Terminal as XTerm } from "xterm";

const EditorView = () => {
    const [tree, setTree] = useState<NodeType[]>([
        {
            id: "codaive-root",
            name: "codaive-web",
            type: "folder",
            children: []
        }
    ]);
    const [selectedFile, setSelectedFile] = useState<NodeType | null>(null);
    const terminalRef = useRef<XTerm | null>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = useCallback(async (content: string) => {
        if (isLoading) return;

        const userMessage: Message = { role: 'user', content };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const conversationHistory = messages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            }));

            conversationHistory.push({
                role: 'user',
                content
            });

            let responseData;
            try {
                const response = await fetch('/api/openrouter-prox', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: 'deepseek/deepseek-prover-v2:free',
                        messages: conversationHistory,
                        temperature: 0.7
                    }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`API error: ${response.status}`);
                }

                responseData = await response.json();
            } catch (fetchError) {
                throw new Error('Failed to connect to AI service');
            }

            const aiResponse = responseData.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
            const aiMessage: Message = { role: 'ai', content: aiResponse };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: Message = {
                role: 'ai',
                content: `Sorry, there was an error: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [messages, isLoading]);

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 min-h-0 overflow-hidden flex-row">
                <ResizableView min={180} max={400} initial={240} side="right">
                    <FileExplorer
                        tree={tree}
                        setTree={setTree}
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}
                    />
                </ResizableView>
                <div className="flex-1 min-w-0 flex flex-col">
                    <CodeEditor
                        selectedFile={selectedFile}
                        terminalRef={terminalRef}
                    />
                    <ResizableView min={100} max={400} initial={120} direction="vertical">
                        <TerminalComponent
                            tree={tree}
                            setTree={setTree}
                            terminalRef={terminalRef}
                        />
                    </ResizableView>
                </div>
                <ResizableView min={260} max={480} initial={320} side="left" className="bg-zinc-900/90 border-l border-zinc-800">
                    <div className="flex-1 overflow-y-auto flex flex-col">
                        <ModalSelector />
                        <ChatBox messages={messages} isLoading={isLoading} />
                        <SuggestionList />
                    </div>
                    <div className="border-t p-2">
                        <CommandInput onSendMessage={sendMessage} isLoading={isLoading} />
                    </div>
                </ResizableView>
            </div>
        </div>
    );
};

export default EditorView;