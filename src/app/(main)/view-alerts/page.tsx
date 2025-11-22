'use client';

import { useApp } from '@/context/app-provider';
import { PageHeader } from '@/components/page-header';
import { AlertCard } from './components/alert-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ViewAlertsPage() {
  const { requests, isClient } = useApp();

  if (!isClient) {
    return (
      <div className="container mx-auto py-8">
        <PageHeader
          title="Active Requests"
          description="View and respond to urgent requests from hospitals."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-60 w-full" />)}
        </div>
      </div>
    );
  }

  const activeRequests = requests.filter((req) => req.status === 'Active');

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Active Requests"
        description="View and respond to urgent requests from hospitals."
      />

      {activeRequests.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeRequests.map((request) => (
            <AlertCard key={request.id} request={request} />
          ))}
        </div>
      ) : (
        <div className="mt-12 flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:bg-gray-800/20">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Active Requests</h3>
          <p className="mt-1 text-sm text-muted-foreground">Check back later for new urgent needs.</p>
        </div>
      )}
    </div>
  );
}
