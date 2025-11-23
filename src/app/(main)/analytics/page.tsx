'use client';

import { useApp } from '@/context/app-provider';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { RequestsOverTimeChart } from './components/requests-over-time-chart';
import { Droplets, Tent, Users } from 'lucide-react';

export default function AnalyticsPage() {
    const { requests, donors, camps, isClient } = useApp();

    if (!isClient) {
        return (
            <div className="container mx-auto py-8">
                <PageHeader
                    title="Analytics"
                    description="Visualize trends and insights from your application data."
                />
                <div className="mt-8 grid gap-6 md:grid-cols-3">
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                </div>
                <div className="mt-8">
                    <Skeleton className="h-80 w-full" />
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8">
            <PageHeader
                title="Analytics"
                description="Visualize trends and insights from your application data."
            />

            <div className="mt-8 grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                        <Droplets className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{requests.length}</div>
                        <p className="text-xs text-muted-foreground">requests made all time</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Registered Donors</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{donors.length}</div>
                        <p className="text-xs text-muted-foreground">donors in the network</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Camps</CardTitle>
                        <Tent className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{camps.length}</div>
                        <p className="text-xs text-muted-foreground">camps scheduled</p>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Urgent Requests Over Last 30 Days</CardTitle>
                        <CardDescription>
                            A line chart showing the volume of urgent blood requests over the past month.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                        <RequestsOverTimeChart data={requests} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
