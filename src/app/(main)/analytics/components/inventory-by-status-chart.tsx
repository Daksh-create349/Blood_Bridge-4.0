'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts';
import { BloodInventory, ResourceStatus } from '@/lib/types';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';

interface ChartProps {
  data: BloodInventory[];
}

const chartConfig = {
  items: {
    label: "Items",
  },
  Available: {
    label: "Available",
    color: "hsl(var(--chart-2))",
  },
  Low: {
    label: "Low",
    color: "hsl(var(--chart-4))",
  },
  Critical: {
    label: "Critical",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;


export function InventoryByStatusChart({ data }: ChartProps) {
  const statuses: ResourceStatus[] = ["Available", "Low", "Critical"];
  
  const chartData = statuses.map(status => ({
    name: status,
    items: data.filter(item => item.status === status).length,
  }));
  
  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <ResponsiveContainer>
        <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" tickLine={false} axisLine={false}/>
          <ChartTooltip
            content={<ChartTooltipContent />}
            cursor={{ fill: 'hsl(var(--muted))' }}
          />
          <Legend />
          <Bar dataKey="items" name="Number of Items" radius={[0, 4, 4, 0]}>
            {chartData.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={chartConfig[entry.name as keyof typeof chartConfig]?.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// Re-importing Cell from recharts as it was removed by mistake in a previous edit
import { Cell } from 'recharts';
