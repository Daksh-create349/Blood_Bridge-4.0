'use client';

import { HeartPulse } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFading(true);
      const fadeOutTimer = setTimeout(() => {
        setIsVisible(false);
      }, 500); // Corresponds to the duration of the fade-out animation
      return () => clearTimeout(fadeOutTimer);
    }, 2500); // Splash screen visible for 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500',
        isFading ? 'opacity-0' : 'opacity-100'
      )}
    >
      <div className="flex items-center space-x-4">
        <HeartPulse className="h-16 w-16 text-primary pulse-icon" />
      </div>
      <h1 className="mt-6 font-headline text-4xl font-bold tracking-tight">
        Blood Bridge
      </h1>
      <p className="mt-2 text-muted-foreground">
        Bridging the gap between need & donor.
      </p>
    </div>
  );
}
