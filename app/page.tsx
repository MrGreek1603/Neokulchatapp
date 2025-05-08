import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { ArrowRight, MessageSquare, Users, Layout } from 'lucide-react';
import { HeroSection } from '@/components/landing/hero-section';
import { FeatureSection } from '@/components/landing/feature-section';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <MessageSquare className="h-5 w-5" />
            <span>ChatForum</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Login
            </Link>
            <Link 
              href="/signup" 
              className={buttonVariants({ size: "sm" })}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <HeroSection />
        <FeatureSection />
      </main>
      
      <footer className="border-t border-border/40 py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 text-sm">
            <MessageSquare className="h-4 w-4" />
            <span>© 2025 ChatForum. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
            <Link href="#">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}