'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Donor } from '@/lib/types';

export const columns: ColumnDef<Donor>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'bloodType',
    header: 'Blood Type',
  },
  {
    accessorKey: 'location',
    header: 'Location',
  },
  {
    accessorKey: 'lastDonationDate',
    header: 'Last Donation',
    cell: ({ row }) => format(new Date(row.original.lastDonationDate), 'dd MMM yyyy'),
  },
  {
    id: 'actions',
    header: 'Contact',
    cell: ({ row }) => {
      const donor = row.original;
      return (
        <TooltipProvider>
          <div className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild>
                  <a href={`tel:${donor.contact.phone}`}>
                    <Phone className="h-4 w-4" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Call {donor.contact.phone}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild>
                  <a href={`mailto:${donor.contact.email}`}>
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Email {donor.contact.email}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      );
    },
  },
];
