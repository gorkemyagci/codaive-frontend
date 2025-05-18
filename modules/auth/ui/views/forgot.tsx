"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import React, { useState } from "react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const Forgot = () => {
  const [sent, setSent] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSent(true);
  };

  return (
    <Card className="w-full max-w-xl bg-transparent border-none rounded-2xl backdrop-blur-md">
      <CardContent className="py-8 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-white mb-6">Forgot Password</h2>
        {sent ? (
          <div className="text-green-400 text-center py-8">If an account exists for this email, a reset link has been sent.</div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-200 text-sm">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} className="bg-zinc-950 border-zinc-700/40 text-white h-11 placeholder:text-zinc-500 focus:border-yellow-400 focus:ring-yellow-400 rounded-md" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-11 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white font-semibold rounded-md text-base transition hover:from-blue-600 hover:via-blue-700 hover:to-cyan-600 shadow-lg">Send</Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default Forgot;
