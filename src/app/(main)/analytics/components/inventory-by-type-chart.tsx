'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BloodInventory, BloodType } from '@/lib/types';
import { ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface ChartProps {
  data: BloodInventory[];
}

export function InventoryByTypeChart({ data }: ChartProps) {
  const bloodTypes: BloodType[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  
  const chartData = bloodTypes.map(type => ({
    name: type,
    units: data
      .filter(item => item.bloodType === type)
      .reduce((sum, item) => sum + item.quantity, 0),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          content={<ChartTooltipContent />}
          cursor={{ fill: 'hsl(var(--muted))' }}
        />
        <Legend />
        <Bar dataKey="units" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
