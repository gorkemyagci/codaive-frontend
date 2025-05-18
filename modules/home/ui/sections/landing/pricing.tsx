"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const features = [
  "AI-Powered Code Completion (GPT-4 & Claude)",
  "AI Assistant & Suggestions",
  "Git & GitHub Integration",
  "AI-Driven Git Workflow (Commits, PRs, Branches)",
  "Run Projects in Browser (Docker Support)",
  "Bring Your Own LLM (Ollama, LM Studio)",
];

const Pricing = () => {
  return (
    <section className="relative w-full py-12 sm:py-20 md:py-32 overflow-hidden bg-black min-h-[100vh] flex flex-col items-center justify-center">
      <h1 className="absolute top-5 lg:-top-5 left-1/2 -translate-x-1/2 text-[10vw] sm:text-[8vw] md:text-[6vw] font-extrabold text-white select-none pointer-events-none z-0 whitespace-nowrap">
        Pricing
      </h1>
      <div className="relative z-10 w-full flex justify-center items-center px-2 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="w-full flex justify-center items-center"
        >
          <Card className="border w-full max-w-full sm:max-w-md md:max-w-lg border-white/10 bg-white/5 backdrop-blur-lg rounded-3xl shadow-2xl hover:shadow-[0_8px_40px_rgba(59,130,246,0.15)] transition-all duration-300 hover:scale-105 flex flex-col items-center p-4 sm:p-5 hover:border-white group">
            <CardHeader className="w-full flex flex-col items-start mb-4 px-0">
              <CardTitle className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight px-0">Free for Now</CardTitle>
              <div className="flex items-end gap-1 sm:gap-0">
                <span className="text-4xl sm:text-5xl font-extrabold text-white">$0</span>
                <span className="text-lg sm:text-xl font-medium text-white">/month</span>
              </div>
            </CardHeader>
            <CardContent className="w-full">
              <ul className="space-y-3 sm:space-y-4">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 sm:gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20">
                      <Check className="h-4 w-4 text-primary" />
                    </span>
                    <span className="text-white/90 text-sm sm:text-base font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="w-full mt-6 sm:mt-8 flex justify-center">
              <Button className="w-full h-11 sm:h-12 group-hover:text-black group-hover:bg-white rounded-full bg-black border border-white text-white font-semibold text-base sm:text-lg shadow-none hover:bg-white hover:text-black transition">Get Started</Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
