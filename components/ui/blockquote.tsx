import { cn } from "@/lib/utils";

type BlockquoteProps = React.HTMLAttributes<HTMLQuoteElement>;

export function Blockquote({ className, ...props }: BlockquoteProps) {
  return (
    <blockquote
      className={cn("mt-6 border-l-2 border-primary pl-6 italic", className)}
      {...props}
    />
  );
} 