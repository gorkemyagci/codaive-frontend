"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Marquee } from "@/components/magicui/marquee";
import { testimonials } from "@/lib/mockData";

const Reviews = () => {
  const firstRow = testimonials.filter((_, i) => i % 2 === 0);
  const secondRow = testimonials.filter((_, i) => i % 2 === 1);

  return (
    <section className="relative py-12 sm:py-20 md:py-32 overflow-hidden bg-transparent">
      <div className="lg:container max-w-sm sm:max-w-2xl md:max-w-3xl  mx-container relative z-10 px-2 sm:px-0">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Loved by
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent ml-2">
              developers
            </span>
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground">
            Join thousands of developers who are already using Codaive to build better software.
          </p>
        </div>

        <div className="mt-8 sm:mt-16 space-y-4">
          <Marquee pauseOnHover className="[--gap:0.75rem] [--duration:8s]">
            {firstRow.map((testimonial) => (
              <div
                key={testimonial.name}
                className="w-full max-w-[340px] mx-auto flex-shrink-0 rounded-2xl border border-blue-500/40 bg-zinc-900/90 p-3 sm:p-6 flex flex-col gap-2 sm:gap-3"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-white text-sm sm:text-base leading-tight">{testimonial.name}</div>
                    <div className="text-xs text-blue-200 leading-tight">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
                <div className="text-white text-xs sm:text-sm">{testimonial.content}</div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-blue-400 text-blue-400" />
                  ))}
                </div>
              </div>
            ))}
          </Marquee>
          <Marquee pauseOnHover reverse className="[--gap:0.75rem] [--duration:8s]">
            {secondRow.map((testimonial) => (
              <div
                key={testimonial.name}
                className="w-full max-w-[340px] mx-auto flex-shrink-0 rounded-2xl border border-blue-500/40 bg-zinc-900/90 p-3 sm:p-6 flex flex-col gap-2 sm:gap-3"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-white text-sm sm:text-base leading-tight">{testimonial.name}</div>
                    <div className="text-xs text-blue-200 leading-tight">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
                <div className="text-white text-xs sm:text-sm">{testimonial.content}</div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-blue-400 text-blue-400" />
                  ))}
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
