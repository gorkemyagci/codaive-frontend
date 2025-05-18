"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Github, Users, ShieldCheck, CheckCircle, Brain, Terminal, GitBranch } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import React from "react";

const formSchema = z.object({
    firstName: z.string().min(1, "Required"),
    lastName: z.string().min(1, "Required"),
    username: z.string().min(3, "At least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Minimum length is 8 characters"),
});

const features = [
    {
        icon: <Brain className="h-6 w-6 text-blue-500" />, title: "AI-Powered Code Completion", desc: "Get intelligent, real-time code suggestions powered by GPT-4 and Claude — write faster, ship smarter."
    },
    {
        icon: <Terminal className="h-6 w-6 text-blue-500" />, title: "Integrated Browser Terminal", desc: "Run and manage your full-stack projects directly in the browser with a Docker-supported terminal."
    },
    {
        icon: <GitBranch className="h-6 w-6 text-blue-500" />, title: "AI-Driven Git Workflow", desc: "Auto-generate commit messages, create pull requests, and manage branches — all with smart AI assistance."
    },
];

const SignIn = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        // handle sign up
        console.log(values);
    };

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#101012] relative overflow-hidden">
            {/* Background grid and radial yellow light */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,230,102,0.10),transparent)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,230,102,0.04),transparent_60%)]" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg width=\\'40\\' height=\\'40\\' viewBox=\\'0 0 40 40\\' fill=\\'none\\' xmlns=\\'http://www.w3.org/2000/svg\\'><path d=\\'M40 0H0V40\\' stroke=\\'%2327272A\\' stroke-width=\\'1\\' opacity=\\'0.3\\'/></svg>')] opacity-60" />
            </div>
            {/* Left panel */}
            <div className="hidden md:flex flex-col justify-between w-full max-w-2xl px-12 py-14">
                <div>
                    <div className="flex items-center gap-2 mb-8">
                        <span className="text-lg font-semibold text-white">Codaive</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Everything you need to code, in one place</h1>
                    <div className="space-y-8 mt-8">
                        {features.map((f, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <div>{f.icon}</div>
                                <div>
                                    <div className="font-semibold text-white mb-1">{f.title}</div>
                                    <div className="text-zinc-400 text-sm leading-relaxed">{f.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-6 text-zinc-500 text-xs mt-12">
                    <a href="#" className="hover:underline">Terms</a>
                    <a href="#" className="hover:underline">Privacy</a>
                    <a href="#" className="hover:underline">Docs</a>
                    <a href="#" className="hover:underline">Helps</a>
                </div>
            </div>
            {/* Right panel (form) */}
            <div className="flex flex-1 w-full items-center justify-center px-4 py-12">
                <Card className="w-full max-w-xl bg-zinc-900/80 border border-zinc-700/40 shadow-xl rounded-2xl backdrop-blur-md">
                    <CardContent className="py-8 px-6 md:px-10">
                        <div className="flex flex-col gap-4 mb-6">
                            <div className="flex gap-2 w-full">
                                <Button variant="outline" className="flex-1 h-11 border-zinc-700/40 bg-zinc-950 text-white hover:bg-zinc-900 gap-2">
                                    <FcGoogle />
                                    Google
                                </Button>
                                <Button variant="outline" className="flex-1 h-11 border-zinc-700/40 bg-zinc-950 text-white hover:bg-zinc-900 gap-2">
                                    <FaGithub />
                                    Github
                                </Button>
                            </div>
                            <div className="flex items-center gap-2 text-zinc-500 text-xs w-full">
                                <div className="flex-grow border-t border-zinc-700/40" />
                                <span>OR</span>
                                <div className="flex-grow border-t border-zinc-700/40" />
                            </div>
                        </div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="flex gap-3">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem className="w-1/2">
                                                <FormLabel className="text-zinc-200 text-sm flex items-center gap-1">First Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="First Name" {...field} className="bg-zinc-950 border-zinc-700/40 text-white h-11 placeholder:text-zinc-500 focus:border-yellow-400 focus:ring-yellow-400 rounded-md outline-0 focus-within:ring-0 focus-within:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem className="w-1/2">
                                                <FormLabel className="text-zinc-200 text-sm flex items-center gap-1">Last Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Last Name" {...field} className="bg-zinc-950 border-zinc-700/40 text-white h-11 placeholder:text-zinc-500 focus:border-yellow-400 focus:ring-yellow-400 rounded-md outline-0 focus-within:ring-0 focus-within:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-zinc-200 text-sm flex items-center gap-1">Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Username" {...field} className="bg-zinc-950 border-zinc-700/40 text-white h-11 placeholder:text-zinc-500 focus:border-yellow-400 focus:ring-yellow-400 rounded-md outline-0 focus-within:ring-0 focus-within:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-zinc-200 text-sm flex items-center gap-1">Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Email" {...field} className="bg-zinc-950 border-zinc-700/40 text-white h-11 placeholder:text-zinc-500 focus:border-yellow-400 focus:ring-yellow-400 rounded-md outline-0 focus-within:ring-0 focus-within:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-zinc-200 text-sm flex items-center gap-1">Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Password" {...field} className="bg-zinc-950 border-zinc-700/40 text-white h-11 placeholder:text-zinc-500 focus:border-yellow-400 focus:ring-yellow-400 rounded-md outline-0 focus-within:ring-0 focus-within:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white" />
                                            </FormControl>
                                            <FormMessage />
                                            <div className="text-xs text-zinc-500 mt-1">Minimum length is 8 characters.</div>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full h-11 mt-2 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white font-semibold rounded-md text-base transition hover:from-blue-600 hover:via-blue-700 hover:to-cyan-600 shadow-lg">Sign Up</Button>
                            </form>
                        </Form>
                        <div className="text-xs text-zinc-400 mt-6 text-center">
                            By creating an account, you agree to the <a href="#" className="underline text-zinc-200">Terms of Service</a>. We'll occasionally send you account-related emails.
                        </div>
                        <div className="text-center text-sm text-zinc-400 mt-4">
                            Already have an account? <a href="#" className="text-white hover:underline">Sign in</a>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SignIn;