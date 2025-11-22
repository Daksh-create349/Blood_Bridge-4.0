'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { HeartPulse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const CountUp = ({ end }: { end: number }) => {
  const [count, setCount] = useState(0);
  const duration = 2000;

  useEffect(() => {
    let start = 0;
    const stepTime = Math.abs(Math.floor(duration / end));
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) {
        clearInterval(timer);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [end]);

  return <span className="font-bold">{count.toLocaleString()}</span>;
};

export default function LandingPage() {
  const bgImage = PlaceHolderImages.find((img) => img.id === 'blood-cells-dark');

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center px-4 overflow-hidden">
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
                <Link href="/dashboard">Access Dashboard</Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full border-white/40 bg-white/10 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white sm:w-auto" asChild>
                <Link href="#mission">Our Mission</Link>
                </Button>
            </div>
        </main>
        
        <div id="mission" className="relative z-10 grid grid-cols-1 gap-8 mt-24 md:grid-cols-3 md:gap-16">
            <div className="flex flex-col items-center">
                <p className="text-4xl lg:text-5xl font-headline bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                    <CountUp end={1287} />
                </p>
                <p className="mt-2 text-sm font-medium text-white/60">Lives Saved</p>
            </div>
            <div className="flex flex-col items-center">
                <p className="text-4xl lg:text-5xl font-headline bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                    <CountUp end={72} />
                </p>
                <p className="mt-2 text-sm font-medium text-white/60">Hospitals Connected</p>
            </div>
            <div className="flex flex-col items-center">
                <p className="text-4xl lg:text-5xl font-headline bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                    <CountUp end={2} />
                </p>
                <p className="mt-2 text-sm font-medium text-white/60">Active Alerts</p>
            </div>
        </div>
    </div>
  );
}
