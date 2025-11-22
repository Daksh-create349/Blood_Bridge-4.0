'use client';

import { useApp } from '@/context/app-provider';
import { PageHeader } from '@/components/page-header';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import { Skeleton } from '@/components/ui/skeleton';

export default function RequestHistoryPage() {
  const { requests, isClient } = useApp();

  if (!isClient) {
    return (
      <div className="container mx-auto py-8">
        <PageHeader
          title="Request History"
          description="Browse and filter through past urgent requests."
        />
        <div className="mt-8 space-y-4">
          <div className="flex items-center py-4 gap-4">
            <Skeleton className="h-10 max-w-sm w-full" />
            <Skeleton className="h-10 w-[180px]" />
          </div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Request History"
        description="Browse and filter through past urgent requests."
      />
      <div className="mt-8">
        <DataTable columns={columns} data={requests} />
      </div>
    </div>
  );
}
