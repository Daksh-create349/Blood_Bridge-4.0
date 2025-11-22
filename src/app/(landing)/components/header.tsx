'use client';

import Link from 'next/link';
import { HeartPulse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-transparent">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <HeartPulse className="h-7 w-7 text-primary" />
          <span className="font-headline text-xl font-bold text-white">Blood Bridge</span>
        </Link>
        <div className="flex items-center gap-3">
            <Button variant="outline" className="text-white border-white/40 hover:bg-white/10 hover:text-white" asChild>
                <Link href="#mission">About Us</Link>
            </Button>
            <Button className="font-bold bg-gradient-to-r from-red-500 to-orange-500 text-white" asChild>
                <Link href="/dashboard">Move to Dashboard</Link>
            </Button>
        </div>
      </div>
    </header>
  );
}
