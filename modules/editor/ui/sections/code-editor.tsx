"use client";
import EditorLoading from "../components/editor-loading";
import { NodeType } from "@/lib/types";
import { useEffect, useRef, useState, useCallback } from "react";
import { Terminal as XTerm } from "xterm";
import { Editor } from "@monaco-editor/react";

interface CodeEditorProps {
    selectedFile: NodeType | null;
    terminalRef?: React.MutableRefObject<XTerm | null>;
}

interface ExecuteCodeResponse {
    language: string;
    version: string;
    run: {
        stdout: string;
        stderr: string;
        output: string;
        code: number | null;
        signal: string | null;
    };
    compile?: {
        stdout: string;
        stderr: string;
        output: string;
        code: number | null;
        signal: string | null;
    };
}

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
    let timer: any;
    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

const CodeEditor = ({ selectedFile, terminalRef }: CodeEditorProps) => {
    const [code, setCode] = useState("");
    const [ghostText, setGhostText] = useState("");
    const [ghostRange, setGhostRange] = useState<any>(null);
    const [isFetchingGhost, setIsFetchingGhost] = useState(false);
    const editorRef = useRef<any>(null);
    const monacoRef = useRef<any>(null);
    const [ghostLineNumber, setGhostLineNumber] = useState<number | null>(null);
    const currentGhostText = useRef<string>("");

    const getLanguage = (filename: string) => {
        const extension = filename.split('.').pop()?.toLowerCase();

        switch (extension) {
            case 'js':
                return 'javascript';
            case 'jsx':
                return 'javascript';
            case 'ts':
                return 'typescript';
            case 'tsx':
                return 'typescript';
            case 'html':
                return 'html';
            case 'css':
                return 'css';
            case 'json':
                return 'json';
            case 'md':
                return 'markdown';
            case 'py':
                return 'python';
            case 'java':
                return 'java';
            case 'c':
                return 'c';
            case 'cpp':
                return 'cpp';
            case 'go':
                return 'go';
            case 'rs':
                return 'rust';
            case 'rb':
                return 'ruby';
            case 'php':
                return 'php';
            case 'sh':
                return 'shell';
            case 'env':
                return 'plaintext';
            default:
                return 'plaintext';
        }
    };

    const getPistonLanguage = (extension: string) => {
        switch (extension) {
            case 'js':
            case 'jsx':
                return { language: 'javascript', version: '18.15.0' };
            case 'ts':
            case 'tsx':
                return { language: 'typescript', version: '5.0.3' };
            case 'py':
                return { language: 'python', version: '3.10.0' };
            case 'java':
                return { language: 'java', version: '15.0.2' };
            case 'c':
                return { language: 'c', version: '10.2.0' };
            case 'cpp':
                return { language: 'cpp', version: '10.2.0' };
            case 'go':
                return { language: 'go', version: '1.16.2' };
            case 'rs':
                return { language: 'rust', version: '1.68.2' };
            case 'rb':
                return { language: 'ruby', version: '3.0.1' };
            case 'php':
                return { language: 'php', version: '8.0.2' };
            case 'sh':
                return { language: 'bash', version: '5.1.0' };
            default:
                return { language: 'javascript', version: '18.15.0' };
        }
    };

    const executeCode = async () => {
        if (!selectedFile || !code.trim() || !terminalRef?.current) return;

        const extension = selectedFile.name.split('.').pop()?.toLowerCase() || '';
        const { language, version } = getPistonLanguage(extension);

        terminalRef.current.writeln(`\r\n[Executing ${selectedFile.name}...]\r\n`);

        try {
            const response = await fetch('https://emkc.org/api/v2/piston/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    language,
                    version,
                    files: [
                        {
                            name: selectedFile.name,
                            content: code,
                        },
                    ],
                    stdin: '',
                    args: [],
                    compile_timeout: 10000,
                    run_timeout: 3000,
                }),
            });

            const data: ExecuteCodeResponse = await response.json();

            if (data.compile && (data.compile.stderr || data.compile.code !== 0)) {
                terminalRef.current.writeln(`\x1b[31m[Compilation Error]\x1b[0m`);
                terminalRef.current.writeln(data.compile.stderr || 'Unknown compilation error');
                return;
            }

            if (data.run.stderr) {
                terminalRef.current.writeln(`\x1b[31m[Error]\x1b[0m`);
                terminalRef.current.writeln(data.run.stderr);
            }

            if (data.run.stdout) {
                terminalRef.current.writeln(data.run.stdout);
            }

            if (data.run.code !== 0) {
                terminalRef.current.writeln(`\x1b[31m[Process exited with code: ${data.run.code}]\x1b[0m`);
            } else {
                terminalRef.current.writeln(`\x1b[32m[Process completed successfully]\x1b[0m`);
            }
        } catch (error) {
            terminalRef.current.writeln(`\x1b[31m[Error] Failed to execute code: ${error instanceof Error ? error.message : String(error)}\x1b[0m`);
        }
    };

    const editorOptions = {
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabCompletion: 'off' as const,
        useTabStops: false,
        quickSuggestions: false,
        suggestOnTriggerCharacters: false,
        acceptSuggestionOnEnter: 'off' as const,
        snippetSuggestions: 'none' as const,
        autoIndent: 'none' as const,
        insertSpaces: false,
        detectIndentation: false,
        tabFocusMode: false,
        wordBasedSuggestions: 'off' as const,
        suggest: { snippetsPreventQuickSuggestions: false },
    };

    const handleEditorDidMount = (editor: any, monacoInstance: any) => {
        editorRef.current = editor;
        monacoRef.current = monacoInstance;

        try {
            if (editor._standaloneKeybindingService && editor._standaloneKeybindingService.addDynamicKeybinding) {
                editor._standaloneKeybindingService.addDynamicKeybinding(
                    'tab',
                    undefined,
                    () => {
                        return true;
                    }
                );
            }
        } catch { }

        editor.addCommand(monacoInstance.KeyCode.Tab, () => {
            const position = editor.getPosition();
            const model = editor.getModel();
            const ghost = currentGhostText.current;
            if (
                ghost &&
                ghost.trim() &&
                position &&
                ghostLineNumber !== null &&
                position.lineNumber === ghostLineNumber
            ) {
                try {
                    const lineNumber = position.lineNumber;
                    const column = position.column;
                    const lineLength = model.getLineMaxColumn(lineNumber);
                    const range = new monacoInstance.Range(
                        lineNumber,
                        column,
                        lineNumber,
                        lineLength
                    );
                    editor.executeEdits('ghost-text', [{
                        range,
                        text: ghost,
                        forceMoveMarkers: true
                    }]);
                    setCode(editor.getValue());
                    setGhostText('');
                    currentGhostText.current = '';
                    setGhostRange(null);
                    setGhostLineNumber(null);
                } catch {}
            } else {
                editor.trigger('keyboard', 'type', { text: '\t' });
            }
        });

        editor.addAction({
            id: 'ghost-text-tab-complete',
            label: 'Ghost Text Tab Complete',
            keybindings: [monacoInstance.KeyCode.Tab],
            precondition: null,
            keybindingContext: null,
            contextMenuGroupId: 'navigation',
            contextMenuOrder: 1.5,
            run: () => {
                const position = editor.getPosition();
                const model = editor.getModel();
                const ghost = currentGhostText.current;
                if (
                    ghost &&
                    ghost.trim() &&
                    position &&
                    ghostLineNumber !== null &&
                    position.lineNumber === ghostLineNumber
                ) {
                    try {
                        const lineNumber = position.lineNumber;
                        const column = position.column;
                        const lineLength = model.getLineMaxColumn(lineNumber);
                        const range = new monacoInstance.Range(
                            lineNumber,
                            column,
                            lineNumber,
                            lineLength
                        );
                        editor.executeEdits('ghost-text', [{
                            range,
                            text: ghost,
                            forceMoveMarkers: true
                        }]);
                        setCode(editor.getValue());
                        setGhostText('');
                        currentGhostText.current = '';
                        setGhostRange(null);
                        setGhostLineNumber(null);
                    } catch {}
                } else {
                    editor.trigger('keyboard', 'type', { text: '\t' });
                }
            }
        });
    };

    const handleEditorChange = (value: string = "") => {
        setCode(value);
        if (editorRef.current) {
            const position = editorRef.current.getPosition();
            if (position) {
                debounceFetch(value, position.lineNumber);
            }
        }
    };

    useEffect(() => {
        if (selectedFile) {
            setCode("");
        }
    }, [selectedFile]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                if (selectedFile && document.activeElement?.closest('.monaco-editor')) {
                    e.preventDefault();
                    if (editorRef.current) {
                        setCode(editorRef.current.getValue());
                        executeCode();
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedFile]);

    const fetchGhostTextForLine = useCallback(async (codeContext: string, line: number) => {
        setIsFetchingGhost(true);
        try {
            const lines = codeContext.split("\n");
            const before = lines.slice(0, line).join("\n");
            const prompt = `Aşağıdaki kodun ${line}. satırını tamamla, sadece devamını döndür:\n\n${before}`;

            const response = await fetch("/api/openrouter-prox", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "deepseek/deepseek-prover-v2:free",
                    messages: [
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.2
                })
            });

            const data = await response.json();
            let suggestion = data.choices?.[0]?.message?.content;
            if (typeof suggestion !== 'string') suggestion = '';

            try {
                suggestion = suggestion.replace(/```[a-zA-Z]*\n?/, '').replace(/```/, '').trim();
            } catch { suggestion = ''; }

            try {
                suggestion = suggestion.split('\n')[0] || '';
            } catch { suggestion = ''; }

            if (!suggestion || typeof suggestion !== 'string' || !suggestion.trim()) {
                setGhostText('');
                currentGhostText.current = '';
                setGhostLineNumber(null);
                return;
            }

            setGhostText(suggestion);
            currentGhostText.current = suggestion;

            setTimeout(() => {
                if (editorRef.current) {
                    const pos = editorRef.current.getPosition();
                    if (pos) setGhostLineNumber(pos.lineNumber);
                }
            }, 0);
        } catch {} finally {
            setIsFetchingGhost(false);
        }
    }, []);

    useEffect(() => {
        if (ghostText) {
            currentGhostText.current = ghostText;
        }
    }, [ghostText, ghostLineNumber]);

    useEffect(() => {
        if (!editorRef.current) return;
        const editor = editorRef.current;

        const onDidChangeCursorPosition = editor.onDidChangeCursorPosition((e: any) => {
            if (ghostLineNumber == null) return;
            const pos = e.position;
            if (pos.lineNumber !== ghostLineNumber) {
                setGhostText("");
                currentGhostText.current = "";
                setGhostRange(null);
                setGhostLineNumber(null);
            }
        });

        return () => {
            onDidChangeCursorPosition.dispose();
        };
    }, [ghostLineNumber]);

    const debounceFetch = useCallback(
        debounce((code: string, line: number) => {
            fetchGhostTextForLine(code, line);
        }, 500),
        [fetchGhostTextForLine]
    );

    useEffect(() => {
        if (!editorRef.current) return;
        const editor = editorRef.current;
        const monaco = monacoRef.current;

        if (ghostRange && ghostRange.decorationId) {
            editor.deltaDecorations([ghostRange.decorationId], []);
        }

        if (!ghostText || !monaco) {
            setGhostRange(null);
            return;
        }

        const position = editor.getPosition();
        if (!position) return;

        const model = editor.getModel();
        if (!model) return;

        const lineNumber = position.lineNumber;
        const column = position.column;

        let lineContent = '';
        try {
            lineContent = model.getLineContent(lineNumber) || '';
        } catch { lineContent = ''; }

        if (typeof lineContent !== 'string') return;
        if (column < 1 || column > lineContent.length + 1) return;

        if (!ghostText.trim()) {
            setGhostRange(null);
            return;
        }

        let decoration;
        try {
            decoration = {
                range: new monaco.Range(lineNumber, column, lineNumber, column),
                options: {
                    after: {
                        content: ghostText,
                        inlineClassName: "ghost-text-inline"
                    }
                }
            };
        } catch { return; }

        let decorationIds = [];
        try {
            decorationIds = editor.deltaDecorations([], [decoration]);
        } catch { return; }

        if (!decorationIds || !decorationIds[0]) return;
        setGhostRange({ decorationId: decorationIds[0], lineNumber, column });
    }, [ghostText]);

    useEffect(() => {
        const styleId = "ghost-text-inline-style";
        if (!document.getElementById(styleId)) {
            const style = document.createElement("style");
            style.id = styleId;
            style.innerHTML = `.ghost-text-inline { opacity: 0.5; font-style: italic; color: #aaa !important; }`;
            document.head.appendChild(style);
        }
    }, []);

    useEffect(() => {
        if (!editorRef.current) return;
        const editor = editorRef.current;
        const domNode = editor.getDomNode();
        if (!domNode) return;

        const handleTab = (e: KeyboardEvent) => {
            if (document.activeElement?.closest('.monaco-editor')) {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    e.stopPropagation();
                    const position = editor.getPosition();
                    const model = editor.getModel();
                    const ghost = currentGhostText.current;
                    if (
                        ghost &&
                        ghost.trim() &&
                        position &&
                        ghostLineNumber !== null &&
                        position.lineNumber === ghostLineNumber
                    ) {
                        const lineNumber = position.lineNumber;
                        const column = position.column;
                        const lineContent = model.getLineContent(lineNumber);
                        const typed = lineContent.slice(0, column - 1);
                        let toInsert = ghost;
                        if (ghost.startsWith(typed)) {
                            toInsert = ghost.slice(typed.length);
                        } else if (ghost.startsWith(lineContent)) {
                            toInsert = ghost.slice(lineContent.length);
                        }
                        const lineLength = model.getLineMaxColumn(lineNumber);
                        const range = new monacoRef.current.Range(
                            lineNumber,
                            column,
                            lineNumber,
                            lineLength
                        );
                        editor.executeEdits('ghost-text', [{
                            range,
                            text: toInsert,
                            forceMoveMarkers: true
                        }]);
                        setCode(editor.getValue());
                        setGhostText('');
                        currentGhostText.current = '';
                        setGhostRange(null);
                        setGhostLineNumber(null);
                    } else {
                        editor.trigger('keyboard', 'type', { text: '\t' });
                    }
                }
            }
        };

        domNode.addEventListener('keydown', handleTab, true);
        return () => {
            domNode.removeEventListener('keydown', handleTab, true);
        };
    }, [ghostLineNumber, setCode, setGhostText]);

    useEffect(() => {
        if (!editorRef.current) return;
        const editor = editorRef.current;
        const domNode = editor.getDomNode();
        if (!domNode) return;

        const handleSave = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
                if (document.activeElement?.closest('.monaco-editor')) {
                    e.preventDefault();
                    e.stopPropagation();
                    setCode(editor.getValue());
                    executeCode();
                }
            }
        };
        domNode.addEventListener('keydown', handleSave, true);
        return () => {
            domNode.removeEventListener('keydown', handleSave, true);
        };
    }, [executeCode, setCode]);

    return (
        <div className="h-[60%] w-full">
            {selectedFile ? (
                <Editor
                    options={editorOptions}
                    height="100%"
                    width="100%"
                    theme="vs-dark"
                    language={getLanguage(selectedFile.name)}
                    loading={<EditorLoading />}
                    value={code}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-zinc-400">
                    <div className="text-center p-6">
                        <h3 className="text-xl mb-2">No file selected</h3>
                        <p className="text-sm">Select a file from the file explorer to start coding.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CodeEditor;