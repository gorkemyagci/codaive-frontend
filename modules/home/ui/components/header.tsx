"use client";
import { Button } from "@/components/ui/button";
import pageUrls from "@/lib/enums/page-urls";
import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import MobileHeader from "./mobile-header";

const navigation = [
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Documentation", href: "#docs" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <nav className="container mx-auto flex h-16 items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <Link href="/" className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Codaive</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex md:items-center md:gap-8"
        >
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <div className="hidden md:flex md:items-center md:gap-4">
            <Link href={pageUrls.AUTH.SIGN_IN} prefetch>
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href={pageUrls.AUTH.SIGN_UP} prefetch>
              <Button size="sm" className="rounded-full">
                Start Coding
              </Button>
            </Link>
          </div>
          <MobileHeader navigation={navigation} isOpen={isOpen} setIsOpen={setIsOpen} />
        </motion.div>
      </nav>
    </header>
  );
};

export default Header; 