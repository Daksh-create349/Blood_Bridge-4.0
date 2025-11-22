'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Droplets, HeartPulse, BrainCircuit, Truck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const lightBg = PlaceHolderImages.find((img) => img.id === 'welcome-light');

  const features = [
    {
      icon: <Droplets className="h-10 w-10 text-primary" />,
      title: 'Real-time Inventory',
      description: 'Monitor blood supply levels across all connected hospitals instantly.',
    },
    {
      icon: <BrainCircuit className="h-10 w-10 text-primary" />,
      title: 'AI-Powered Forecasting',
      description: 'Predict supply shortages before they happen with our intelligent analytics.',
    },
    {
      icon: <Truck className="h-10 w-10 text-primary" />,
      title: 'Smart Logistics',
      description: 'Optimize delivery routes for critical supplies, ensuring timely delivery.',
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: 'Donor & Camp Management',
      description: 'Easily find and register for donation camps and manage donor information.',
    },
  ];

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="absolute inset-0 z-0">
            {lightBg && (
                <Image
                    src={lightBg.imageUrl}
                    alt={lightBg.description}
                    fill
                    className="object-cover opacity-10 dark:opacity-5"
                    data-ai-hint={lightBg.imageHint}
                    priority
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <HeartPulse className="mx-auto mb-6 h-16 w-16 text-primary" />
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Blood Bridge
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
            An intelligent platform bridging the gap between blood donors and patients in need. Save lives, one drop at a time.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="font-headline text-lg w-full sm:w-auto">
              <Link href="/dashboard">
                Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-headline text-lg w-full sm:w-auto">
              <Link href="/camps">
                Find a Camp
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-headline text-3xl font-bold sm:text-4xl">Why Blood Bridge?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              We leverage technology to create a seamless and efficient ecosystem for blood management.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="rounded-lg border bg-card p-6 text-center shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="mb-4 inline-block rounded-full bg-primary/10 p-4">
                  {feature.icon}
                </div>
                <h3 className="font-headline text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-headline text-3xl font-bold sm:text-4xl">Simple Steps to Save Lives</h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              Whether you're a hospital in need or a donor ready to help, our process is straightforward.
            </p>
          </div>
          <div className="grid gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-primary/10 font-headline text-2xl font-bold text-primary">1</div>
              <h3 className="mt-6 font-headline text-xl font-semibold">Hospitals Request</h3>
              <p className="mt-2 text-muted-foreground">Medical centers broadcast urgent needs for specific blood types in just a few clicks.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-primary/10 font-headline text-2xl font-bold text-primary">2</div>
              <h3 className="mt-6 font-headline text-xl font-semibold">Donors Respond</h3>
              <p className="mt-2 text-muted-foreground">Nearby donors and blood banks are alerted, and can respond to fulfill requests or find donation camps.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-primary/10 font-headline text-2xl font-bold text-primary">3</div>
              <h3 className="mt-6 font-headline text-xl font-semibold">Lives Saved</h3>
              <p className="mt-2 text-muted-foreground">Our smart logistics ensure timely delivery, connecting life-saving donations to patients in need.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Join Our Mission Today
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
            Your participation can make a world of difference. Become a part of the Blood Bridge community.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="font-headline text-lg">
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
