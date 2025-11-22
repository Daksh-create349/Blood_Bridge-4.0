'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts';
import { BloodInventory, BloodType } from '@/lib/types';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';

interface ChartProps {
  data: BloodInventory[];
}

const chartConfig = {
  units: {
    label: "Units",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function InventoryByTypeChart({ data }: ChartProps) {
  const bloodTypes: BloodType[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  
  const chartData = bloodTypes.map(type => ({
    name: type,
    units: data
      .filter(item => item.bloodType === type)
      .reduce((sum, item) => sum + item.quantity, 0),
  }));

  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <ChartTooltip
            content={<ChartTooltipContent />}
            cursor={{ fill: 'hsl(var(--muted))' }}
          />
          <Legend />
          <Bar dataKey="units" fill="var(--color-units)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
