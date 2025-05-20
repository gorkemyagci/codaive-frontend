"use client"
import { useRef, useState } from "react";

export function ResizableView({
  min = 160,
  max = 480,
  initial = 220,
  children,
  className = "",
  side = "right",
  direction = "horizontal",
}: {
  min?: number;
  max?: number;
  initial?: number;
  children: React.ReactNode;
  className?: string;
  side?: "right" | "left";
  direction?: "horizontal" | "vertical";
}) {
  const [size, setSize] = useState(initial);
  const dragging = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    const start = direction === "horizontal" ? e.clientX : e.clientY;
    const startSize = size;
    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!dragging.current) return;
      const move = direction === "horizontal"
        ? (side === "right" ? moveEvent.clientX - start : start - moveEvent.clientX)
        : start - moveEvent.clientY;
      const newSize = Math.min(max, Math.max(min, startSize + move));
      setSize(newSize);
    };
    const onMouseUp = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  if (direction === "vertical") {
    return (
      <div
        style={{ height: size, minHeight: min, maxHeight: max }}
        className={`relative w-full flex flex-col ${className}`}
      >
        <div
          onMouseDown={handleMouseDown}
          className="absolute top-0 left-0 w-full h-2 cursor-row-resize z-20 hover:bg-zinc-800/40 transition"
          style={{ userSelect: "none" }}
        />
        <div className="flex-1 min-h-0">{children}</div>
      </div>
    );
  }

  return (
    <aside
      style={{ width: size, minWidth: min, maxWidth: max }}
      className={`shrink-0 min-h-0 flex flex-col relative select-none ${className}`}
    >
      {children}
      <div
        onMouseDown={handleMouseDown}
        className={`absolute top-0 ${side === "right" ? "right-0" : "left-0"} w-2 h-full cursor-col-resize z-20 hover:bg-zinc-800/40 transition`}
        style={{ userSelect: "none" }}
      />
    </aside>
  );
}