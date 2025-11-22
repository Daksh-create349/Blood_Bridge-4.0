'use client';

import { useApp } from '@/context/app-provider';
import { PageHeader } from '@/components/page-header';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import { Skeleton } from '@/components/ui/skeleton';

export default function DonorsPage() {
  const { donors, isClient } = useApp();

  if (!isClient) {
    return (
      <div className="container mx-auto py-8">
        <PageHeader
          title="Donor Database"
          description="Manage and connect with your network of registered donors."
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
        title="Donor Database"
        description="Manage and connect with your network of registered donors."
      />
      <div className="mt-8">
        <DataTable columns={columns} data={donors} />
      </div>
    </div>
  );
}
