'use client';

import { useApp } from '@/context/app-provider';
import { PageHeader } from '@/components/page-header';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';

export default function RequestHistoryPage() {
  const { requests } = useApp();

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
