'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { UrgentRequest } from '@/lib/types';
import { cn } from '@/lib/utils';

const statusColors: { [key in UrgentRequest['status']]: string } = {
  Active: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800',
  Fulfilled: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
  Expired: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700/50 dark:text-gray-400 dark:border-gray-600',
};

export const columns: ColumnDef<UrgentRequest>[] = [
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => format(new Date(row.original.createdAt), 'dd MMM yyyy'),
  },
  {
    accessorKey: 'hospitalName',
    header: 'Hospital',
  },
  {
    accessorKey: 'bloodType',
    header: 'Blood Type',
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity (units)',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return <Badge className={cn(statusColors[status])} variant="outline">{status}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'fulfilledBy',
    header: 'Fulfilled By',
    cell: ({ row }) => row.original.fulfilledBy || 'N/A',
  },
];
