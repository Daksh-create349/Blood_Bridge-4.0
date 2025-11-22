'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Siren, Droplets, Hospital, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { UrgentRequest } from '@/lib/types';
import { cn } from '@/lib/utils';
import { DonationDialog } from './donation-dialog';

interface AlertCardProps {
  request: UrgentRequest;
  allRequests: UrgentRequest[];
}

const urgencyColors: { [key in UrgentRequest['urgency']]: string } = {
  Critical: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-400 dark:border-red-800',
  High: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800',
  Moderate: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800',
};

export function AlertCard({ request, allRequests }: AlertCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const timeAgo = formatDistanceToNow(new Date(request.createdAt), { addSuffix: true });

  return (
    <>
      <Card className="flex flex-col border-l-4 border-primary shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <Siren className="h-6 w-6 text-primary" />
              Need: {request.bloodType}
            </CardTitle>
            <Badge className={cn(urgencyColors[request.urgency])} variant="outline">{request.urgency}</Badge>
          </div>
          <CardDescription>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Hospital className="h-4 w-4" />
              {request.hospitalName}, {request.hospitalLocation}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          <div className="flex items-center text-lg">
            <Droplets className="mr-2 h-5 w-5 text-muted-foreground" />
            <span className="font-bold">{request.quantity} units</span>
            <span className="mx-2 text-muted-foreground">|</span>
            <span>Radius: {request.broadcastRadius}km</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            <span>Posted {timeAgo}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => setIsDialogOpen(true)}>
            I Can Donate
          </Button>
        </CardFooter>
      </Card>
      <DonationDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        request={request}
        allRequests={allRequests}
      />
    </>
  );
}
