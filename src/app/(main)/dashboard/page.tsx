'use client';

import { useState } from 'react';
import { useApp } from '@/context/app-provider';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResourceCard } from './components/resource-card';
import { ResourceStatus } from '@/lib/types';
import { AlertTriangle, Droplets, ShieldCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { inventory, hospitals, isClient } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ResourceStatus | 'All'>('All');

  if (!isClient) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader title="Resource Inventory" description="Monitor and manage blood supply levels." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card><CardHeader><Skeleton className="h-4 w-2/3" /></CardHeader><CardContent><Skeleton className="h-8 w-1/3" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-4 w-2/3" /></CardHeader><CardContent><Skeleton className="h-8 w-1/3" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-4 w-2/3" /></CardHeader><CardContent><Skeleton className="h-8 w-1/3" /></CardContent></Card>
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-sm max-w-sm" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-52 w-full" />)}
        </div>
      </div>
    );
  }

  const filteredInventory = inventory.filter((item) => {
    const hospital = hospitals.find(h => h.id === item.hospitalId);
    const hospitalName = hospital?.name.toLowerCase() || '';
    const hospitalLocation = hospital?.location.toLowerCase() || '';

    const matchesSearch =
      item.bloodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospitalName.includes(searchTerm.toLowerCase()) ||
      hospitalLocation.includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const criticalCount = inventory.filter(item => item.status === 'Critical').length;
  const lowCount = inventory.filter(item => item.status === 'Low').length;
  const totalUnits = inventory.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="container mx-auto py-8 flex flex-col gap-8">
      <PageHeader title="Resource Inventory" description="Monitor and manage blood supply levels." />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Supplies</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">Items needing immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Supplies</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{lowCount}</div>
            <p className="text-xs text-muted-foreground">Items running low</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
            <Droplets className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUnits}</div>
            <p className="text-xs text-muted-foreground">Total units available</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-4">
        <Input
          placeholder="Filter by blood type, hospital, or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={(value: ResourceStatus | 'All') => setStatusFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Available">Available</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredInventory.map((item) => (
          <ResourceCard key={item.id} resource={item} />
        ))}
      </div>
       {filteredInventory.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No resources match the current filters.</p>
          </div>
        )}
    </div>
  );
}
