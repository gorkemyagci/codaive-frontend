"use client";
const suggestions = [
  "Optimize your code",
  "Analyze errors",
  "Generate test function",
  "Get refactor suggestions",
  "Generate documentation",
];
const SuggestionList = () => {
  return (
    <div className="px-4 py-2 pb-1 border-b border-zinc-800 bg-zinc-900/80">
      <div className="font-semibold text-xs text-muted-foreground mb-3">Suggestions</div>
      <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
        {suggestions.map((s, i) => (
          <button
            key={i}
            className="px-2 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-medium hover:bg-blue-600 hover:text-white transition-colors border border-zinc-700 focus:outline-none whitespace-nowrap"
            tabIndex={0}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};
export default SuggestionList;