import { Bell, CheckCircle, Truck } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { LogisticsEvent } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ActivityFeedProps {
  events: LogisticsEvent[];
}

const eventIcons = {
  DISPATCH: <Truck className="h-4 w-4 text-blue-500" />,
  DELIVERY: <CheckCircle className="h-4 w-4 text-green-500" />,
  INFO: <Bell className="h-4 w-4 text-yellow-500" />,
};

const eventColors = {
    DISPATCH: "border-blue-500/40",
    DELIVERY: "border-green-500/40",
    INFO: "border-yellow-500/40",
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-6 pr-4">
            {events.length === 0 && (
                <div className="text-center text-muted-foreground py-10">
                    <Bell className="mx-auto h-8 w-8 mb-2"/>
                    <p>Waiting for logistics activity...</p>
                </div>
            )}
            {events.map((event) => (
              <div key={event.id} className={cn("flex items-start gap-4 p-3 rounded-lg border-l-4", eventColors[event.type])}>
                <div className="mt-1">{eventIcons[event.type]}</div>
                <div className="flex-1">
                  <p className="text-sm">{event.message}</p>
                  <p className="text-xs text-muted-foreground mt-1" title={format(new Date(event.timestamp), "PPpp")}>
                    {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
