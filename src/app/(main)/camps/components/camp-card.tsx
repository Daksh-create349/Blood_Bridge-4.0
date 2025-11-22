'use client';

import { format } from 'date-fns';
import { Tent, MapPin, Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { DonationCamp } from '@/lib/types';

interface CampCardProps {
  camp: DonationCamp;
  onRegister: (camp: DonationCamp) => void;
}

export function CampCard({ camp, onRegister }: CampCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Tent className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="font-headline">{camp.name}</CardTitle>
            <CardDescription>by {camp.organizer}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-center text-sm">
          <MapPin className="mr-3 h-4 w-4 text-muted-foreground" />
          <span>{camp.location}</span>
        </div>
        <div className="flex items-center text-sm">
          <Calendar className="mr-3 h-4 w-4 text-muted-foreground" />
          <span>{format(new Date(camp.date), 'EEEE, MMMM dd, yyyy')}</span>
        </div>
        <div className="flex items-center text-sm">
          <Clock className="mr-3 h-4 w-4 text-muted-foreground" />
          <span>{camp.timings}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => onRegister(camp)}>
          Register to Participate
        </Button>
      </CardFooter>
    </Card>
  );
}
