"use client";
import { Editor } from "@monaco-editor/react";
import EditorLoading from "../components/editor-loading";

const CodeEditor = () => {
    return <div className="h-[60%] w-full">
        <Editor
            options={{
                minimap: {
                    enabled: false,
                },
            }}
            height="100%"
            theme="vs-dark"
            language="javascript"
            loading={<EditorLoading />}
        />
    </div>;
};

export default CodeEditor;