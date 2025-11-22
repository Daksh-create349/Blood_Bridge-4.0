'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { BloodInventory, ResourceStatus } from '@/lib/types';
import { ChartTooltipContent } from '@/components/ui/chart';

interface ChartProps {
  data: BloodInventory[];
}

export function InventoryByStatusChart({ data }: ChartProps) {
  const statuses: ResourceStatus[] = ["Available", "Low", "Critical"];
  
  const chartData = statuses.map(status => ({
    name: status,
    items: data.filter(item => item.status === status).length,
  }));
  
  const statusColors: Record<ResourceStatus, string> = {
    Available: 'hsl(var(--chart-2))',
    Low: 'hsl(var(--chart-4))',
    Critical: 'hsl(var(--destructive))',
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false}/>
        <Tooltip
          content={<ChartTooltipContent />}
          cursor={{ fill: 'hsl(var(--muted))' }}
        />
        <Legend />
        <Bar dataKey="items" name="Number of Items" radius={[0, 4, 4, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={statusColors[entry.name as ResourceStatus]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
