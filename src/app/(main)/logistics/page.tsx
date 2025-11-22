'use client';

import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { useApp } from '@/context/app-provider';
import dynamic from 'next/dynamic';
import { ActivityFeed } from './components/activity-feed';

const LogisticsMap = dynamic(
  () => import('./components/logistics-map').then((mod) => mod.LogisticsMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full" />,
  }
);

export default function LogisticsPage() {
  const { isClient } = useApp();

  return (
    <div className="flex h-full flex-col">
      <div className="container mx-auto py-8">
        <PageHeader
          title="Smart Logistics"
          description="Visualize real-time delivery routes and status updates."
        />
      </div>
      <div className="flex-1 grid grid-cols-1 gap-6 p-4 md:grid-cols-3 lg:grid-cols-4 overflow-hidden">
        <div className="h-full col-span-1 md:col-span-2 lg:col-span-3">
          <div className="h-full w-full rounded-lg border overflow-hidden">
            {isClient ? <LogisticsMap /> : <Skeleton className="h-full w-full" />}
          </div>
        </div>
        <div className="h-full col-span-1 md:col-span-1 lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
