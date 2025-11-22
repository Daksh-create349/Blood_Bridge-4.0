'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useApp } from '@/context/app-provider';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamically import the map component to ensure it only runs on the client-side
const LogisticsMap = dynamic(() => import('./components/logistics-map').then(mod => mod.LogisticsMap), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

export default function LogisticsPage() {
  const { vehicles, isClient } = useApp();

  if (!isClient) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 sm:p-6 md:p-8">
            <PageHeader
            title="Smart Logistics"
            description="Real-time tracking of blood supply deliveries."
            />
        </div>
        <div className="flex-grow">
            <Skeleton className="h-full w-full" />
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
      <div className="flex-grow border-t">
        <LogisticsMap initialVehicles={vehicles} />
      </div>
    </div>
  );
}
