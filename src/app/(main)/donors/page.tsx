'use client';

import { useApp } from '@/context/app-provider';
import { PageHeader } from '@/components/page-header';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';

export default function DonorsPage() {
  const { donors } = useApp();

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Registered Donors"
        description="Manage and view the list of all registered blood donors."
      />
      <div className="mt-8">
        <DataTable columns={columns} data={donors} />
      </div>
    </div>
  );
}
