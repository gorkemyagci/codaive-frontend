"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Chen",
    role: "Senior Frontend Developer",
    company: "Vercel",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    content:
      "Codaive has completely transformed my development workflow. The AI-powered code completion and Git integration have made me significantly more productive.",
    rating: 5,
  },
  {
    name: "Sarah Johnson",
    role: "Full Stack Developer",
    company: "Stripe",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    content:
      "The terminal integration and Docker support are game-changers. I can now run and test my projects entirely in the browser.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Backend Engineer",
    company: "GitHub",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
    content:
      "Real-time file system editing and AI-powered PRs have made my workflow seamless. Highly recommended!",
    rating: 5,
  },
];

const Reviews = () => {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      <div className="container mx-container relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Loved by{" "}
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              developers
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of developers who are already using Codaive to build better software.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border border-zinc-700 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(var(--primary),0.2)] hover:border-primary/60">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                      />
                    ))}
                  </div>
                  <blockquote className="mt-4 text-muted-foreground">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-primary to-blue-500 rounded-full blur-sm" />
                      <Avatar className="relative">
                        <AvatarImage src={testimonial.image} alt={testimonial.name} />
                        <AvatarFallback>
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <div className="font-semibold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mx-auto mt-16 max-w-2xl text-center"
        >
          <div className="rounded-full border border-primary/20 bg-gradient-to-r from-primary/5 via-blue-500/5 to-cyan-500/5 p-6 backdrop-blur-sm">
            <p className="text-lg text-muted-foreground">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">4.9/5</span> average rating
              from{" "}
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">1,000+</span> developers
            </p>
          </div>
        </motion.div>
      </div>
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(35rem_35rem_at_top,theme(colors.primary.500/10%),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(25rem_25rem_at_bottom,theme(colors.blue.500/10%),transparent)]" />
      </div>
    </section>
  );
};

export default Reviews;
