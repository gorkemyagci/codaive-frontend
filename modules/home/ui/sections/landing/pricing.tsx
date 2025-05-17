"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const features = [
  "Advanced AI code completion",
  "Docker container support",
  "Auto Git commits & PRs",
  "Unlimited projects",
  "Priority support",
  "Team collaboration",
  "Custom themes",
  "API access",
];

const Pricing = () => {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      <div className="container mx-container relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Start coding for{" "}
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              free
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get access to all features. No credit card required.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="relative h-full border-primary/50 bg-gradient-to-br from-primary/10 via-blue-500/5 to-cyan-500/5 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(var(--primary),0.3)] hover:border-primary/80">
              <CardHeader>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-100 bg-clip-text text-transparent">Free for Now</CardTitle>
                <CardDescription className="text-base">Access to all features</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">$0</span>
                  <span className="text-muted-foreground">/for now</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full h-10 rounded-full bg-gradient-to-r from-primary to-primary/80">
                  Get Started Now
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto mt-16 max-w-2xl text-center"
        >
          <p className="text-sm text-muted-foreground">
            Have questions?{" "}
            <a href="#" className="font-semibold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent hover:underline">
              Contact us
            </a>{" "}
            for more information.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
