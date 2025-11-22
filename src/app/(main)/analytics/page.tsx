'use client';

import { useApp } from '@/context/app-provider';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InventoryByTypeChart } from './components/inventory-by-type-chart';
import { InventoryByStatusChart } from './components/inventory-by-status-chart';
import { RequestsOverTimeChart } from './components/requests-over-time-chart';
import { Skeleton } from '@/components/ui/skeleton';

export default function AnalyticsPage() {
  const { inventory, requests, isClient } = useApp();

  if (!isClient) {
    return (
      <div className="container mx-auto py-8">
        <PageHeader
          title="Analytics"
          description="Visualize blood inventory data to gain insights."
        />
        <div className="mt-8 grid gap-8 md:grid-cols-1">
           <Card>
            <CardHeader>
              <CardTitle>Urgent Requests (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px]" />
            </CardContent>
          </Card>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Inventory by Blood Type</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px]" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Inventory by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px]" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Analytics"
        description="Visualize blood inventory data to gain insights."
      />
      <div className="mt-8 grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Urgent Requests (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <RequestsOverTimeChart data={requests} />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inventory by Blood Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <InventoryByTypeChart data={inventory} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inventory by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <InventoryByStatusChart data={inventory} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
