"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GitBranch, GitCommit, GitPullRequest, Sparkles } from "lucide-react";

const steps = [
  {
    title: "AI-Powered Commits",
    description: "Automatically generate meaningful commit messages based on your code changes.",
    icon: GitCommit,
  },
  {
    title: "Smart Branch Management",
    description: "Create and manage branches with AI-suggested names based on your feature.",
    icon: GitBranch,
  },
  {
    title: "PR Generation",
    description: "Generate pull requests with detailed descriptions and change summaries.",
    icon: GitPullRequest,
  },
];

const AutoCommit = () => {
  return (
    <section className="py-12 sm:py-20 md:py-32">
      <div className="container mx-container px-2 sm:px-0">
        <div className="w-full grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-xl border bg-gradient-to-br from-card via-background to-card/80 p-4 shadow-2xl">
              <div className="absolute right-3 top-3 flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="flex items-center gap-2 border-b pb-2">
                <GitCommit className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Git History</span>
              </div>
              <pre className="mt-4 overflow-x-hidden text-sm rounded-lg bg-black/70 p-4 text-white shadow-inner">
                <code className="text-white text-left font-mono">
                  {`$ git add .
$ git commit -m "feat: implement user authentication system

- Add JWT-based authentication
- Create login and register endpoints
- Implement password hashing
- Add user model and migrations"

$ git push origin feature/auth
$ git create-pr

Creating pull request...
Title: Implement user authentication system
Description: This PR adds a complete authentication system with JWT...`}
                </code>
              </pre>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="absolute hidden lg:block -bottom-6 -right-4 z-10 max-w-full rounded-xl border-2 border-blue-500/60 bg-gradient-to-br from-blue-900/80 via-blue-800/60 to-card/80 p-4 shadow-2xl ring-2 ring-blue-400/30 backdrop-blur-md"
            >
              <div className="flex items-center gap-2 border-b border-blue-400/30 pb-2">
                <Sparkles className="h-4 w-4 text-blue-400 animate-pulse" />
                <span className="text-sm font-semibold text-blue-200 bg-blue-500/20 rounded px-2 py-0.5">AI Suggestions</span>
              </div>
              <pre className="mt-4 overflow-x-auto text-sm text-blue-100 font-mono">
                <code className="text-blue-100 text-left">
                  {`Suggested commit message:
"feat: implement user authentication system"

Suggested PR title:
"Implement user authentication system"

Suggested PR description:
"This PR adds a complete authentication system..."`}
                </code>
              </pre>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center mt-8 sm:mt-0"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              AI-Powered Git Workflow
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Let AI handle your Git operations. From meaningful commit messages to
              detailed pull requests, Codaive makes version control smarter.
            </p>

            <div className="mt-8 space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  <step.icon className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-1 text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8">
              <Button size="lg" className="rounded-full font-semibold">
                Try AI Git Features
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AutoCommit;
