"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { features } from "@/lib/mockData";
import { motion } from "framer-motion";
import { Brain, Terminal, GitBranch, FileCode } from "lucide-react";

const Features = () => {
  return (
    <section className="relative py-12 sm:py-20 md:py-32 overflow-hidden">
      <div className="container mx-container relative z-10 px-2 sm:px-0">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Everything you need to code, in{" "}
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              one place
            </span>
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground">
            Codaive combines powerful development tools with AI assistance to make coding faster and more efficient.
          </p>
        </div>

        <div className="mt-8 sm:mt-16 flex flex-col sm:flex-row justify-between gap-4 sm:gap-5 max-w-full sm:max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card
                className="h-full border border-zinc-700 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(var(--primary),0.2)] hover:border-primary/60"
              >
                <CardHeader>
                  <motion.div
                    className="inline-block transition-transform duration-300"
                  >
                    <feature.icon className="h-9 w-9 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                  </motion.div>
                  <CardTitle className="mt-4 text-xl text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted-foreground">
                    {feature.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
