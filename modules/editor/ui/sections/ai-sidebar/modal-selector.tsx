"use client";
import { useState } from "react";

// Only Deepseek model is available
const models = ["Deepseek"];

const ModalSelector = () => {
  const [selected, setSelected] = useState("Deepseek");
  
  return (
    <div className="px-4 pt-4 pb-2 bg-zinc-900/80 border-b border-zinc-800 shadow-sm">
      <div className="font-semibold text-xs text-muted-foreground mb-2 tracking-wide">Model</div>
      <div className="flex gap-2">
        {models.map((model) => (
          <button
            key={model}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors focus:outline-none border
              ${selected === model
                ? "bg-zinc-800 border-blue-500 text-blue-400 shadow"
                : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:bg-zinc-800"}
            `}
            onClick={() => setSelected(model)}
          >
            {model}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModalSelector;