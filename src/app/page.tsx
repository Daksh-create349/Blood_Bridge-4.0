'use client';

import Image from 'next/image';
import Link from 'next/link';
import { HeartPulse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function WelcomePage() {
  const bgImage = PlaceHolderImages.find((img) => img.id === 'blood-cells-dark');

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 overflow-hidden bg-slate-950 text-white">
      {bgImage && (
        <Image
          src={bgImage.imageUrl}
          alt={bgImage.description}
          fill
          className="object-cover opacity-20"
          data-ai-hint={bgImage.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>

      <header className="absolute top-0 z-10 w-full">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <HeartPulse className="h-7 w-7 text-primary" />
            <span className="font-headline text-xl font-bold text-white">Blood Bridge</span>
          </Link>
          <div className="flex items-center gap-3">
              <Button variant="outline" className="text-white border-white/40 hover:bg-white/10 hover:text-white" asChild>
                  <Link href="/dashboard">About Us</Link>
              </Button>
              <Button className="font-bold bg-gradient-to-r from-red-500 to-orange-500 text-white" asChild>
                  <Link href="/dashboard">Move to Dashboard</Link>
              </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex flex-col items-center">
          <div className="flex items-center justify-center w-24 h-24 mb-8 rounded-full bg-primary/20 ring-4 ring-primary/50">
              <HeartPulse className="h-12 w-12 text-primary" />
          </div>

          <h1 className="font-headline text-5xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl">
              Blood{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              Bridge
              </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-white/70 md:text-xl">
              Bridging the critical gap between urgent need and willing donor.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold sm:w-auto" asChild>
              <Link href="/dashboard">Move to Dashboard</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full border-white/40 bg-white/10 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white sm:w-auto" asChild>
              <Link href="/dashboard">About Us</Link>
              </Button>
          </div>
      </main>

      <footer className="absolute bottom-0 w-full bg-transparent text-white/80 py-6">
        <div className="container mx-auto px-4 text-center">
            <p className="text-sm">
            &copy; {new Date().getFullYear()} Blood Bridge. All rights reserved.
            </p>
        </div>
      </footer>
    </div>
  );
}
