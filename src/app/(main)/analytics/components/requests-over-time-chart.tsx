'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { subDays, format, eachDayOfInterval } from 'date-fns';
import { UrgentRequest } from '@/lib/types';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';

interface ChartProps {
  data: UrgentRequest[];
}

const chartConfig = {
  requests: {
    label: "Requests",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function RequestsOverTimeChart({ data }: ChartProps) {
  const endDate = new Date();
  const startDate = subDays(endDate, 29);

  const dailyRequests = eachDayOfInterval({ start: startDate, end: endDate }).map(day => {
    const formattedDate = format(day, 'MMM d');
    const count = data.filter(req => format(new Date(req.createdAt), 'MMM d') === formattedDate).length;
    return { date: formattedDate, requests: count };
  });

  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <ResponsiveContainer>
        <LineChart
          data={dailyRequests}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="date" 
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.split(' ')[1]}
          />
          <YAxis 
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Line
            type="monotone"
            dataKey="requests"
            stroke="var(--color-requests)"
            strokeWidth={2}
            dot={{
              r: 4,
              fill: "var(--color-requests)",
              stroke: "var(--background)"
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
