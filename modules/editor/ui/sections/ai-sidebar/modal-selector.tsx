"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
const models = ["GPT-4", "Claude", "Ollama"];
const ModalSelector = () => {
  const [selected, setSelected] = useState("GPT-4");
  return (
    <div className="p-2 border-b">
      <div className="font-semibold text-xs text-muted-foreground mb-1">Model Seçici</div>
      <div className="flex gap-2">
        {models.map((model) => (
          <Button
            key={model}
            size="sm"
            variant={selected === model ? "default" : "secondary"}
            className="text-xs px-2 py-1"
            onClick={() => setSelected(model)}
          >
            {model}
          </Button>
        ))}
      </div>
    </div>
  );
};
export default ModalSelector;