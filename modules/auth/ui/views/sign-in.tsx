"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import React from "react";
import Link from "next/link";
import pageUrls from "@/lib/enums/page-urls";

const formSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Minimum length is 8 characters"),
});

const SignIn = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values);
    };

    return (
        <Card className="w-full max-w-xl bg-transparent border-none rounded-2xl backdrop-blur-md">
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
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end -mt-2 mb-2">
                            <Link href={pageUrls.AUTH.FORGOT_PASSWORD} prefetch className="text-xs text-white font-medium hover:underline transition">Forgot password?</Link>
                        </div>
                        <Button type="submit" className="w-full h-11 mt-2 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white font-semibold rounded-md text-base transition hover:from-blue-600 hover:via-blue-700 hover:to-cyan-600 shadow-lg">Sign In</Button>
                    </form>
                </Form>
                <div className="text-center text-sm text-zinc-400 mt-4">
                    Don&apos;t have an account? <Link href={pageUrls.AUTH.SIGN_UP} prefetch className="text-white hover:underline">Sign up</Link>
                </div>
            </CardContent>
        </Card>
    );
};

export default SignIn;