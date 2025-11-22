'use client';

import { useApp } from '@/context/app-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Bot, CheckCircle, Truck } from 'lucide-react';
import { format } from 'date-fns';

export function ActivityFeed() {
  const { logisticsEvents } = useApp();

  const getIcon = (message: string) => {
    if (message.includes('Dispatched')) return <Truck className="h-4 w-4 text-blue-500" />;
    if (message.includes('Delivered')) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <Truck className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-4 pr-4">
            {logisticsEvents.length > 0 ? (
              logisticsEvents.map(event => (
                <div key={event.id} className="flex items-start gap-3">
                  <div className="mt-1">{getIcon(event.message)}</div>
                  <div className="flex-1">
                    <p className="text-sm">{event.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(event.timestamp), 'HH:mm:ss')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <p>Waiting for logistics activity...</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
