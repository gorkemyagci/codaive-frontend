"use client";
import { Editor } from "@monaco-editor/react";

const CodeEditor = () => {
    return <div className="h-full w-full">
        <Editor
            options={{
                minimap: {
                    enabled: false,
                },
            }}
            height="100%"
            theme="vs-dark"
            language="javascript"
        />
    </div>;
};

export default CodeEditor;