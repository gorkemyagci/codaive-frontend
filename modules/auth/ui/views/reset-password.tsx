"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import React, { useState } from "react";
import Link from "next/link";
import pageUrls from "@/lib/enums/page-urls";

const formSchema = z
  .object({
    password: z.string().min(8, "Minimum length is 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ResetPassword = () => {
  const [success, setSuccess] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSuccess(true);
  };

  return (
    <Card className="w-full max-w-xl bg-transparent border-none rounded-2xl backdrop-blur-md">
      <CardContent className="py-8 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-white mb-6">Reset Password</h2>
        {success ? (
          <div className="text-green-400 text-center py-8">Your password has been reset successfully.</div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-200 text-sm">New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter new password" {...field} className="bg-zinc-950 border-zinc-700/40 text-white h-11 placeholder:text-zinc-500 focus:border-yellow-400 focus:ring-yellow-400 rounded-md" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-200 text-sm">Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm new password" {...field} className="bg-zinc-950 border-zinc-700/40 text-white h-11 placeholder:text-zinc-500 focus:border-yellow-400 focus:ring-yellow-400 rounded-md" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-11 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white font-semibold rounded-md text-base transition hover:from-blue-600 hover:via-blue-700 hover:to-cyan-600 shadow-lg">Reset Password</Button>
            </form>
          </Form>
        )}
      </CardContent>
      <div className="text-center">
        <Link href={pageUrls.AUTH.SIGN_IN} prefetch className="text-sm text-white font-semibold hover:underline transition">Back to sign in</Link>
      </div>
    </Card>
  );
};

export default ResetPassword;
