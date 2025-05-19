"use client";

type TerminalControlsProps = {
  onClear?: () => void;
  onCopy?: () => void;
  onNew?: () => void;
  onTheme?: () => void;
};

const TerminalControls = ({ onClear, onCopy, onNew, onTheme }: TerminalControlsProps) => {
  return (
    <div className="flex items-center gap-2 px-2 py-1 border-b bg-background">
      <button onClick={onClear} className="text-xs px-2 py-1 rounded hover:bg-accent">Clear</button>
      <button onClick={onCopy} className="text-xs px-2 py-1 rounded hover:bg-accent">Copy</button>
      <button onClick={onNew} className="text-xs px-2 py-1 rounded hover:bg-accent">New</button>
      <button onClick={onTheme} className="text-xs px-2 py-1 rounded hover:bg-accent">Theme</button>
    </div>
  );
};

export default TerminalControls;