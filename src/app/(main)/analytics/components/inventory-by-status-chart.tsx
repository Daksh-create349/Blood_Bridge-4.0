'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
    Available: '#22c55e', // green-500
    Low: '#f59e0b',       // yellow-500
    Critical: '#ef4444',  // red-500
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" />
        <Tooltip
          content={<ChartTooltipContent />}
          cursor={{ fill: 'hsl(var(--muted))' }}
        />
        <Legend />
        <Bar dataKey="items" name="Number of Items">
          {chartData.map((entry, index) => (
            <rect key={`bar-${index}`} fill={statusColors[entry.name as ResourceStatus]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
