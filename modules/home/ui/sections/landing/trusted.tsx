"use client";
import { motion } from "framer-motion";
import { Blockquote } from "@/components/ui/blockquote";
import { Icons } from "@/components/icons";

const companies = [
  { name: "Vercel" },
  { name: "GitHub" },
  { name: "Stripe" },
  { name: "Notion" },
  { name: "Linear" },
];

const Trusted = () => {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      <div className="container mx-auto relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by developers at{" "}
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              leading companies
            </span>
          </h2>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
            {companies.map((company) => (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative h-8 w-32 grayscale transition-all duration-300 hover:grayscale-0 hover:scale-110 hover:brightness-110"
              >
                {company.name === "Vercel" && <Icons.vercel className="h-8 w-8" />}
                {company.name === "GitHub" && <Icons.github className="h-8 w-8" />}
                {company.name === "Stripe" && <Icons.stripe className="h-8 w-8" />}
                {company.name === "Notion" && <Icons.notion className="h-8 w-8" />}
                {company.name === "Linear" && <Icons.linear className="h-8 w-8" />}
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto mt-16 max-w-3xl"
        >
          <Blockquote className="text-center relative">
            <div className="absolute inset-0 rounded-2xl -z-10" />
            <p className="text-xl text-muted-foreground">
              "Codaive has transformed how our team collaborates on code. The AI-powered features
              and seamless GitHub integration have made our development process significantly more
              efficient."
            </p>
            <footer className="mt-6">
              <div className="flex items-center justify-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary to-blue-500 rounded-full blur-sm" />
                  <img
                    src="https://randomuser.me/api/portraits/women/11.jpg"
                    alt="Sarah Chen"
                    className="relative h-12 w-12 rounded-full ring-2 ring-primary/20"
                  />
                </div>
                <div className="text-left">
                  <div className="font-semibold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">Sarah Chen</div>
                  <div className="text-sm text-muted-foreground">
                    Engineering Lead at Linear
                  </div>
                </div>
              </div>
            </footer>
          </Blockquote>
        </motion.div>
      </div>
    </section>
  );
};

export default Trusted;
