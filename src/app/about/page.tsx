'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Send,
  Bell,
  Truck,
  BrainCircuit,
  Tent,
  ArrowLeft,
  HeartPulse,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: <LayoutDashboard className="h-8 w-8" />,
    title: 'Real-Time Dashboard',
    description:
      'Get an instant overview of blood inventory levels across all connected hospitals. Visual cues for critical, low, and available supplies make it easy to assess needs at a glance.',
    video: 'https://cdn.pixabay.com/video/2022/07/16/124333-730771399_large.mp4',
    aiHint: 'dashboard analytics'
  },
  {
    icon: <Send className="h-8 w-8" />,
    title: 'Send Urgent Requests',
    description:
      'Broadcast urgent blood needs to a network of donors and blood banks within a specified radius. The system ensures your request reaches the right people instantly.',
      video: 'https://cdn.pixabay.com/video/2019/03/20/22139-325698660_large.mp4',
      aiHint: 'emergency alert'
  },
  {
    icon: <Bell className="h-8 w-8" />,
    title: 'Active Alerts',
    description:
      "View and respond to active, high-priority requests from nearby hospitals. Donors can immediately see where their contribution is needed most urgently.",
      video: 'https://media.istockphoto.com/id/1990685945/video/e-mail-text-messaging-e-mail-spam-notification-icon-text-online-messaging.mp4?s=mp4-640x640-is&k=20&c=0UTn6XQZk1KoAk0ZkV6aTyZWpsaIf9tzMzQW19gd2M4=',
      aiHint: 'notification bell'
  },
  {
    icon: <Truck className="h-8 w-8" />,
    title: 'Smart Logistics',
    description:
      'Visualize and track blood deliveries in real-time. Our logistics map shows vehicle routes, ETAs, and delivery statuses to ensure timely and efficient transportation.',
      video: 'https://cdn.pixabay.com/video/2023/02/06/149580-796481264_large.mp4',
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
    <div className="relative min-h-screen w-full bg-slate-950 text-white">
       <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        style={{ opacity: '0.5' }}
      >
        <source
          src="https://cdn.pixabay.com/video/2019/09/12/26799-359604172_large.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black/50 z-10"></div>

       <header className="absolute top-0 z-30 w-full">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <HeartPulse className="h-7 w-7 text-primary" />
            <span className="font-headline text-xl font-bold text-white">Blood Bridge</span>
          </Link>
          <div className="flex items-center gap-3">
              <Button variant="outline" className="text-white border-white/40 hover:bg-white/10 hover:text-white" asChild>
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Welcome
                  </Link>
              </Button>
          </div>
        </div>
      </header>

      <main className="relative z-20 py-24">
        <div className="container mx-auto">
            <div className="text-center mb-16">
                 <h1 className="font-headline text-5xl font-extrabold tracking-tight text-white md:text-6xl">
                    About{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                    Blood Bridge
                    </span>
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-white/90 md:text-xl">
                    Connecting donors, hospitals, and communities to save lives through technology and dedication.
                </p>
            </div>
            
            <div className="space-y-24">
                {features.map((feature, index) => (
                <div
                    key={feature.title}
                    className="group grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16 animate-fade-in"
                    style={{ animationDelay: `${index * 200}ms` }}
                >
                    <div className={cn("flex flex-col justify-center", index % 2 === 1 && 'md:order-last')}>
                    <div className="mb-4 flex items-center gap-4">
                        <div className="flex-shrink-0 text-primary bg-primary/10 p-3 rounded-full">
                        {feature.icon}
                        </div>
                        <h2 className="font-headline text-3xl font-bold">{feature.title}</h2>
                    </div>
                    <p className="text-lg text-white/80">{feature.description}</p>
                    </div>
                    
                    <div className="overflow-hidden rounded-lg shadow-2xl shadow-primary/20">
                      {feature.video ? (
                        <video
                          src={feature.video}
                          autoPlay
                          loop
                          muted
                          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <Image
                          src={feature.image!}
                          alt={feature.title}
                          width={600}
                          height={400}
                          data-ai-hint={feature.aiHint}
                          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </div>
                </div>
                ))}
            </div>
        </div>
      </main>
      
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
