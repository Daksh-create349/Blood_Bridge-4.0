'use client';

import { Droplets } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { BloodInventory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { UpdateUnitsDialog } from './update-units-dialog';

interface ResourceCardProps {
  resource: BloodInventory;
}

const statusColors: { [key in BloodInventory['status']]: string } = {
  Available: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
  Low: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800',
  Critical: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-400 dark:border-red-800',
};

export function ResourceCard({ resource }: ResourceCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
      <Card className="flex flex-col">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="font-headline text-2xl">{resource.bloodType}</CardTitle>
            <Badge className={cn(statusColors[resource.status])} variant="outline">{resource.status}</Badge>
          </div>
          <CardDescription>{resource.location}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center">
            <Droplets className="mr-2 h-5 w-5 text-primary" />
            <span className="text-3xl font-bold">{resource.quantity}</span>
            <span className="ml-2 text-sm text-muted-foreground">units</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => setIsDialogOpen(true)}>Update Units</Button>
        </CardFooter>
      </Card>
      <UpdateUnitsDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        resource={resource}
      />
    </>
  );
}
