'use client';

import Image from 'next/image';
import Link from 'next/link';
import { HeartPulse } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

export default function WelcomePage() {
  const lightBg = PlaceHolderImages.find((img) => img.id === 'welcome-light');
  const darkBg = PlaceHolderImages.find((img) => img.id === 'welcome-dark');

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center">
      <div className="absolute inset-0 z-0">
        {lightBg && (
          <Image
            src={lightBg.imageUrl}
            alt={lightBg.description}
            fill
            className="object-cover brightness-50 dark:hidden"
            data-ai-hint={lightBg.imageHint}
            priority
          />
        )}
        {darkBg && (
          <Image
            src={darkBg.imageUrl}
            alt={darkBg.description}
            fill
            className="hidden object-cover brightness-50 dark:block"
            data-ai-hint={darkBg.imageHint}
            priority
          />
        )}
      </div>
      <div className="relative z-10 flex flex-col items-center text-center text-white">
        <HeartPulse className="mb-4 h-20 w-20 text-primary" />
        <h1 className="font-headline text-5xl font-bold md:text-7xl">
          Blood Bridge
        </h1>
        <p className="mt-4 max-w-lg text-lg text-gray-200">
          Bridging the gap between need & donor.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="font-headline text-lg">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary" size="lg" className="font-headline text-lg">
                About Us
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="font-headline text-2xl">About Blood Bridge</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4 text-muted-foreground">
                <p>
                  Blood Bridge is a smart, AI-powered platform designed to connect blood banks, hospitals, and donors. Our mission is to efficiently manage blood supplies, broadcast urgent needs, and help save lives by preventing critical shortages.
                </p>
                <h3 className="font-headline text-xl font-semibold text-foreground">Our Vision</h3>
                <ul className="list-disc space-y-2 pl-5">
                  <li><span className="font-semibold">Save Lives:</span> By ensuring timely access to blood, we aim to reduce fatalities due to shortages.</li>
                  <li><span className="font-semibold">Build Community:</span> We foster a strong network of donors, volunteers, and healthcare professionals committed to a common cause.</li>
                  <li><span className="font-semibold">Innovate:</span> Leveraging AI and modern technology, we are making the process of blood donation and management more efficient and accessible.</li>
                </ul>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
