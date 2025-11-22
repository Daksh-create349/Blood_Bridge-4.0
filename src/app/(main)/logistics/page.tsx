'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useApp } from '@/context/app-provider';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { ActivityFeed } from './components/activity-feed';

// Dynamically import the map component to ensure it only runs on the client-side
const LogisticsMap = dynamic(() => import('./components/logistics-map').then(mod => mod.LogisticsMap), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

export default function LogisticsPage() {
  const { vehicles, logisticsEvents, isClient } = useApp();

  if (!isClient) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 sm:p-6 md:p-8">
            <PageHeader
            title="Smart Logistics"
            description="Real-time tracking of blood supply deliveries."
            />
        </div>
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
            <div className="lg:col-span-2 h-[400px] lg:h-auto">
                <Skeleton className="h-full w-full" />
            </div>
            <div className="h-[400px] lg:h-auto">
                 <Skeleton className="h-full w-full" />
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
       <div className="p-4 sm:p-6 md:p-8">
         <PageHeader
            title="Smart Logistics"
            description="Real-time tracking of blood supply deliveries."
        />
       </div>
       <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:p-6 md:p-8 pt-0">
          <div className="lg:col-span-2 rounded-lg border overflow-hidden">
            <LogisticsMap />
          </div>
          <div className="rounded-lg">
            <ActivityFeed events={logisticsEvents} />
          </div>
       </div>
    </div>
  );
}
