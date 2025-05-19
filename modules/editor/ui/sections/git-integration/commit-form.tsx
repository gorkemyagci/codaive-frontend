"use client";
import { Button } from "@/components/ui/button";
const CommitForm = () => {
  return (
    <form className="flex flex-col gap-2 p-2">
      <div className="font-semibold text-xs text-muted-foreground mb-1">Commit Mesajı</div>
      <input className="px-2 py-1 rounded bg-muted text-xs outline-none" placeholder="Commit mesajı..." />
      <Button type="submit" size="sm" className="text-xs px-2 py-1">Commit</Button>
    </form>
  );
};
export default CommitForm;