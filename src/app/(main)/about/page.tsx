'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LayoutDashboard,
  Send,
  Bell,
  History,
  Tent,
  AreaChart,
  Users,
  Truck,
  BrainCircuit,
} from 'lucide-react';
import Image from 'next/image';

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
      />
      <div className="mt-12 grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        {features.map((feature, index) => (
          <Card
            key={feature.title}
            className="group flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/50 animate-fade-in"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="overflow-hidden">
                <Image
                    src={feature.image}
                    alt={feature.title}
                    width={600}
                    height={400}
                    data-ai-hint={feature.aiHint}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="flex-shrink-0 text-primary">{feature.icon}</div>
              <div>
                <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
