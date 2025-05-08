"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <motion.div 
            className="flex flex-col justify-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2">
              <motion.h1 
                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Connect, Chat, and Collaborate in One Place
              </motion.h1>
              <motion.p 
                className="max-w-[600px] text-muted-foreground md:text-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                A modern platform for real-time messaging, forums, and community building.
              </motion.p>
            </div>
            <motion.div 
              className="flex flex-col gap-2 min-[400px]:flex-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link href="/signup">
                <Button size="lg" className="gap-1.5">
                  Get Started
                  <svg 
                    className="h-4 w-4" 
                    fill="none" 
                    height="24" 
                    stroke="currentColor" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    viewBox="0 0 24 24" 
                    width="24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Login
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          <motion.div 
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="relative h-[350px] w-full max-w-[450px] overflow-hidden rounded-xl border bg-background p-4 shadow-xl">
              <div className="flex h-full flex-col rounded-lg bg-muted/50">
                <div className="flex h-12 items-center justify-between border-b px-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium">General Chat</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
                    <div className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
                    <div className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
                  </div>
                </div>
                <div className="flex-1 p-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10" />
                      <div className="rounded-lg bg-muted p-3">
                        <p className="text-sm">Hey everyone, welcome to the chat! 👋</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10" />
                      <div className="rounded-lg bg-muted p-3">
                        <p className="text-sm">Has anyone seen the new updates?</p>
                      </div>
                    </div>
                    <div className="flex flex-row-reverse items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10" />
                      <div className="rounded-lg bg-primary p-3">
                        <p className="text-sm text-primary-foreground">Yes! The new forum features are amazing!</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t p-4">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 rounded-md border bg-background px-3 py-2 shadow-sm">
                      <p className="text-sm text-muted-foreground">Type a message...</p>
                    </div>
                    <Button size="icon" variant="ghost">
                      <svg 
                        className="h-4 w-4" 
                        fill="none" 
                        height="24" 
                        stroke="currentColor" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        viewBox="0 0 24 24" 
                        width="24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="m22 2-7 20-4-9-9-4Z" />
                        <path d="M22 2 11 13" />
                      </svg>
                      <span className="sr-only">Send</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}