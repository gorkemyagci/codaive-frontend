"use client";
import { Button } from "@/components/ui/button";
const CommandInput = () => {
  return (
    <form className="flex gap-2">
      <input
        className="flex-1 px-2 py-1 rounded bg-muted text-xs outline-none"
        placeholder="/analyze, /commit, /test ..."
      />
      <Button type="submit" size="sm" className="text-xs px-2 py-1">Gönder</Button>
    </form>
  );
};
export default CommandInput;