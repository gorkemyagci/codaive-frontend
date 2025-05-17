"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Code2, Terminal, GitBranch, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-32">
      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              The AI Code Editor for{" "}
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                Developers
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Run projects with terminal, AI assistant, and GitHub integration — all in your browser.
              Experience the future of coding with Codaive.
            </p>
            <div className="mt-10 flex items-center justify-center gap-3">
              <Button size="lg" className="rounded-full bg-gradient-to-r from-primary to-blue-500 font-semibold">
                Start Coding Free
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full border-primary/20">
                View Demo
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16"
          >
            <div className="relative rounded-xl border border-primary/30 bg-gradient-to-br from-zinc-900/90 via-zinc-800/90 to-zinc-900/90 p-4 shadow-2xl ring-2 ring-primary/20 backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_40px_rgba(var(--primary),0.3)] hover:border-primary/60">
              <div className="absolute right-3 top-3 flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500 shadow-lg" />
                <div className="h-3 w-3 rounded-full bg-yellow-400 shadow-lg" />
                <div className="h-3 w-3 rounded-full bg-green-500 shadow-lg" />
              </div>
              <div className="flex items-center gap-2 border-b border-primary/20 pb-2">
                <Code2 className="h-4 w-4 text-primary drop-shadow-[0_0_12px_rgba(var(--primary),0.6)]" />
                <span className="text-sm text-primary font-semibold">app/page.tsx</span>
              </div>
              <pre className="mt-4 overflow-x-auto text-xs font-mono text-left text-zinc-100 bg-transparent">
                <code>
                  {`import { useState } from 'react';
import { AI } from '@codaive/ai';

export default function Home() {
  const [code, setCode] = useState('');

  return (
    <div className="container mx-container">
      <AI.Editor
        value={code}
        onChange={setCode}
        suggestions={true}
        theme="dark"
      />
    </div>
  );`}
                </code>
              </pre>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
              <span>Integrated Terminal</span>
            </div>
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
              <span>Git Integration</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
              <span>AI Assistant</span>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.primary.500/20%),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(30rem_30rem_at_bottom_left,theme(colors.blue.500/15%),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(25rem_25rem_at_bottom_right,theme(colors.cyan.500/10%),transparent)]" />
      </div>
    </section>
  );
};

export default Hero;
