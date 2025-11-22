'use client';

import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { useApp } from '@/context/app-provider';
import dynamic from 'next/dynamic';

const LogisticsMap = dynamic(
  () => import('./components/logistics-map').then((mod) => mod.LogisticsMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[calc(100vh-10rem)] w-full" />,
  }
);

export default function LogisticsPage() {
  const { isClient } = useApp();

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Smart Logistics"
        description="Visualize real-time delivery routes between facilities."
      />
      <div className="mt-8 h-[calc(100vh-10rem)] w-full rounded-lg border overflow-hidden">
        {isClient ? <LogisticsMap /> : <Skeleton className="h-full w-full" />}
      </div>
    </div>
  );
}
