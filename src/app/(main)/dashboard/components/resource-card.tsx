'use client';

import { Droplets, Hospital as HospitalIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { BloodInventory, Hospital } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { UpdateUnitsDialog } from './update-units-dialog';
import { useApp } from '@/context/app-provider';
import { HospitalDetailsDialog } from './hospital-details-dialog';

interface ResourceCardProps {
  resource: BloodInventory;
}

const statusColors: { [key in BloodInventory['status']]: string } = {
  Available: 'bg-green-500/10 text-green-400 border-green-500/20',
  Low: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Critical: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export function ResourceCard({ resource }: ResourceCardProps) {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { hospitals } = useApp();

  const hospital = hospitals.find(h => h.id === resource.hospitalId);

  return (
    <>
      <Card className="flex flex-col bg-card/50 backdrop-blur-sm border-border/20 hover:border-primary/50 transition-colors duration-300">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="font-headline text-3xl font-bold text-primary">{resource.bloodType}</CardTitle>
            <Badge className={cn("text-xs", statusColors[resource.status])} variant="outline">{resource.status}</Badge>
          </div>
          <CardDescription 
            className="flex items-center gap-2 cursor-pointer hover:text-primary"
            onClick={() => setIsDetailsOpen(true)}
          >
            <HospitalIcon className="h-4 w-4" />
            {hospital?.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center">
            <Droplets className="mr-2 h-6 w-6 text-primary" />
            <span className="text-4xl font-bold">{resource.quantity}</span>
            <span className="ml-2 text-sm text-muted-foreground">units</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => setIsUpdateOpen(true)}>Update Units</Button>
        </CardFooter>
      </Card>
      <UpdateUnitsDialog
        isOpen={isUpdateOpen}
        onOpenChange={setIsUpdateOpen}
        resource={resource}
      />
      {hospital && (
        <HospitalDetailsDialog 
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          hospital={hospital}
        />
      )}
    </>
  );
}
