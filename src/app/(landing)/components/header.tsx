'use client';

import Link from 'next/link';
import { HeartPulse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/theme-toggle';

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <HeartPulse className="h-7 w-7 text-primary" />
          <span className="font-headline text-xl font-bold">Blood Bridge</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            How It Works
          </Link>
        </nav>
        <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
            </Button>
        </div>
      </div>
    </header>
  );
}
