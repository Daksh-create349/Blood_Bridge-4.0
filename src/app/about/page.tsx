'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Send,
  Bell,
  Truck,
  BrainCircuit,
  Tent,
  ArrowLeft,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: <LayoutDashboard className="h-8 w-8" />,
    title: 'Real-Time Dashboard',
    description:
      'Get an instant overview of blood inventory levels across all connected hospitals. Visual cues for critical, low, and available supplies make it easy to assess needs at a glance.',
    image: 'https://picsum.photos/seed/feat1/600/400',
    aiHint: 'dashboard analytics'
  },
  {
    icon: <Send className="h-8 w-8" />,
    title: 'Send Urgent Requests',
    description:
      'Broadcast urgent blood needs to a network of donors and blood banks within a specified radius. The system ensures your request reaches the right people instantly.',
      image: 'https://picsum.photos/seed/feat2/600/400',
      aiHint: 'emergency alert'
  },
  {
    icon: <Bell className="h-8 w-8" />,
    title: 'Active Alerts',
    description:
      "View and respond to active, high-priority requests from nearby hospitals. Donors can immediately see where their contribution is needed most urgently.",
      image: 'https://picsum.photos/seed/feat3/600/400',
      aiHint: 'notification bell'
  },
  {
    icon: <Truck className="h-8 w-8" />,
    title: 'Smart Logistics',
    description:
      'Visualize and track blood deliveries in real-time. Our logistics map shows vehicle routes, ETAs, and delivery statuses to ensure timely and efficient transportation.',
      image: 'https://picsum.photos/seed/feat4/600/400',
      aiHint: 'delivery truck'
  },
  {
    icon: <BrainCircuit className="h-8 w-8" />,
    title: 'AI Supply Forecasting',
    description:
      'Leverage artificial intelligence to analyze inventory data and predict potential shortages. Proactively manage your supply chain and mitigate risks before they become critical.',
      image: 'https://picsum.photos/seed/feat5/600/400',
      aiHint: 'artificial intelligence'
  },
  {
    icon: <Tent className="h-8 w-8" />,
    title: 'Donation Camps',
    description:
      'Discover and register for upcoming blood donation camps. Our interactive map and detailed listings make it simple to find a convenient location to donate.',
      image: 'https://picsum.photos/seed/feat6/600/400',
      aiHint: 'community event'
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="About Blood Bridge"
        description="Connecting donors, hospitals, and communities to save lives."
      >
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Welcome
          </Link>
        </Button>
      </PageHeader>
      
      <div className="mt-12 space-y-16">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="group grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12 animate-fade-in"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <div className={cn("flex flex-col justify-center", index % 2 === 1 && 'md:order-last')}>
              <div className="mb-4 flex items-center gap-4">
                <div className="flex-shrink-0 text-primary bg-primary/10 p-3 rounded-full">
                  {feature.icon}
                </div>
                <h2 className="font-headline text-3xl font-bold">{feature.title}</h2>
              </div>
              <p className="text-lg text-muted-foreground">{feature.description}</p>
            </div>
            
            <div className="overflow-hidden rounded-lg shadow-xl">
              <Image
                src={feature.image}
                alt={feature.title}
                width={600}
                height={400}
                data-ai-hint={feature.aiHint}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.7s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
