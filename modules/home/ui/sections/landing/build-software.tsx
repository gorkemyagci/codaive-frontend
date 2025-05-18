"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Terminal, Code2, Package } from "lucide-react";

const BuildSoftware = () => {
    return (
        <section className="py-12 sm:py-20 md:py-32">
            <div className="container mx-container px-2 sm:px-0">
                <div className="w-full grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="flex flex-col justify-center"
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                            Run your projects in your browser
                        </h2>
                        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground">
                            Codaive provides a complete development environment with Docker containers,
                            allowing you to run any Node.js, Next.js, or other project directly in your browser.
                        </p>

                        <div className="mt-6 sm:mt-8 space-y-4">
                            <div className="flex items-start gap-4">
                                <Terminal className="mt-1 h-5 w-5 text-primary" />
                                <div>
                                    <h3 className="font-semibold text-foreground">Integrated Terminal</h3>
                                    <p className="mt-1 text-muted-foreground">
                                        Full-featured terminal with Docker support and custom shell commands.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <Code2 className="mt-1 h-5 w-5 text-primary" />
                                <div>
                                    <h3 className="font-semibold text-foreground">Live Code Preview</h3>
                                    <p className="mt-1 text-muted-foreground">
                                        See your changes in real-time with hot reloading and instant previews.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <Package className="mt-1 h-5 w-5 text-primary" />
                                <div>
                                    <h3 className="font-semibold text-foreground">Package Management</h3>
                                    <p className="mt-1 text-muted-foreground">
                                        Install and manage dependencies with npm, yarn, or pnpm.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 sm:mt-8">
                            <Button size="lg" className="w-full sm:w-auto rounded-full">
                                Try it now
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="relative mt-8 sm:mt-0 hidden lg:block"
                    >
                        <div className="relative rounded-xl border bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-4 shadow-2xl ring-2 ring-primary/10 backdrop-blur-md">
                            <div className="absolute right-3 top-3 flex gap-2">
                                <div className="h-3 w-3 rounded-full bg-red-500 shadow-lg" />
                                <div className="h-3 w-3 rounded-full bg-yellow-400 shadow-lg" />
                                <div className="h-3 w-3 rounded-full bg-green-500 shadow-lg" />
                            </div>
                            <div className="flex items-center gap-2 border-b border-zinc-700 pb-2">
                                <Terminal className="h-4 w-4 text-primary" />
                                <span className="text-sm text-primary font-semibold">Terminal</span>
                            </div>
                            <pre className="overflow-x-auto mt-2 text-xs font-mono text-left text-zinc-100 bg-transparent">
                                <code>
                                    <span className="text-green-400">$ npm create next-app@latest my-project</span>
                                    {"\n"}
                                    <span className="text-green-400">$ cd my-project</span>
                                    {"\n"}
                                    <span className="text-green-400">$ npm run dev</span>
                                    {"\n\n"}
                                    <span className="text-cyan-400">&gt; Ready in 300ms - Local: http://localhost:3000</span>
                                    {"\n"}
                                    <span className="text-cyan-400">&gt; Ready in 300ms - Network: http://192.168.1.100:3000</span>
                                </code>
                            </pre>
                        </div>

                        <div className="absolute top-[11.5rem] -right-12 rounded-xl border bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-4 shadow-2xl ring-2 ring-primary/10 backdrop-blur-md">
                            <div className="flex items-center gap-2 border-b border-zinc-700 pb-2">
                                <Code2 className="h-4 w-4 text-primary" />
                                <span className="text-sm text-primary font-semibold">app/page.tsx</span>
                            </div>
                            <pre className="mt-4 overflow-x-auto text-xs font-mono text-left text-zinc-100 bg-transparent">
                                <code>
                                    {`export default function Home() {\n  return (\n    <main className=\"flex min-h-screen flex-col items-center justify-center p-24\">\n      <h1 className=\"text-4xl font-bold text-primary\">Welcome to Next.js</h1>\n      <p className=\"mt-4 text-zinc-400\">Get started by editing app/page.tsx</p>\n    </main>\n  );\n}`}
                                </code>
                            </pre>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default BuildSoftware;
