import Navbar from "../components/navbar";
import FileExplorer from "../sections/file-explorer";
import CodeEditor from "../sections/code-editor";
import TerminalControls from "../sections/terminal/terminal-controls";
import ChatBox from "../sections/ai-sidebar/chat-box";
import CommandInput from "../sections/ai-sidebar/command-input";
import ModalSelector from "../sections/ai-sidebar/modal-selector";
import SuggestionList from "../sections/ai-sidebar/suggestion-list";
import CommitForm from "../sections/git-integration/commit-form";
import GitHistory from "../sections/git-integration/git-history";
import PrCreator from "../sections/git-integration/pr-creator";
import TerminalComponent from "../sections/terminal/terminal";

const EditorView = () => {
    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 min-h-0">
                {/* Sol: File Explorer */}
                <aside className="w-56 border-r bg-background/90 flex-shrink-0 min-h-0 flex flex-col">
                    <FileExplorer />
                </aside>
                {/* Orta: Code Editor */}
                <main className="flex-1 min-w-0 flex flex-col">
                    <div className="flex-1 min-h-0">
                        <CodeEditor />
                    </div>
                </main>
                {/* Sağ: AI Sidebar */}
                <aside className="w-80 border-l bg-background/95 flex-shrink-0 min-h-0 flex flex-col">
                    <div className="flex-1 overflow-y-auto">
                        <ModalSelector />
                        <ChatBox />
                        <SuggestionList />
                    </div>
                    <div className="border-t p-2">
                        <CommandInput />
                    </div>
                </aside>
            </div>

        </div>
    );
};

export default EditorView;