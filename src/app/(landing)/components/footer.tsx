import Link from 'next/link';
import { HeartPulse } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-transparent text-white/80 py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Blood Bridge. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
