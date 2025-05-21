"use client";
import { Editor } from "@monaco-editor/react";
import EditorLoading from "../components/editor-loading";
import { NodeType } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { Terminal as XTerm } from "xterm";

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

const CodeEditor = ({ selectedFile, terminalRef }: CodeEditorProps) => {
    const [code, setCode] = useState("");
    const editorRef = useRef<any>(null);
    
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
            
            // Handle compilation errors if any
            if (data.compile && (data.compile.stderr || data.compile.code !== 0)) {
                terminalRef.current.writeln(`\x1b[31m[Compilation Error]\x1b[0m`);
                terminalRef.current.writeln(data.compile.stderr || 'Unknown compilation error');
                return;
            }
            
            // Handle execution errors
            if (data.run.stderr) {
                terminalRef.current.writeln(`\x1b[31m[Error]\x1b[0m`);
                terminalRef.current.writeln(data.run.stderr);
            }
            
            // Show output
            if (data.run.stdout) {
                terminalRef.current.writeln(data.run.stdout);
            }
            
            // Show exit code if non-zero
            if (data.run.code !== 0) {
                terminalRef.current.writeln(`\x1b[31m[Process exited with code: ${data.run.code}]\x1b[0m`);
            } else {
                terminalRef.current.writeln(`\x1b[32m[Process completed successfully]\x1b[0m`);
            }
        } catch (error) {
            terminalRef.current.writeln(`\x1b[31m[Error] Failed to execute code: ${error instanceof Error ? error.message : String(error)}\x1b[0m`);
        }
    };
    
    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor;
        editor.addCommand(
            // Monaco.KeyMod.CtrlCmd | Monaco.KeyCode.KeyS (would be the correct way, but need to import Monaco)
            // Using keyCodes: Cmd/Ctrl(2048) + S(83)
            2048 | 83,
            () => {
                setCode(editor.getValue());
                executeCode();
            }
        );
    };
    
    const handleEditorChange = (value: string = "") => {
        setCode(value);
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
    }, [selectedFile, executeCode]);

    return (
        <div className="h-[60%] w-full">
            {selectedFile ? (
                <Editor
                    options={{
                        minimap: {
                            enabled: false,
                        },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                    }}
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