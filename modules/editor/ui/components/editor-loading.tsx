"use client";

export default function EditorLoading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
      <div className="text-sm text-zinc-400 font-medium tracking-wide">Loading editor...</div>
    </div>
  );
}
