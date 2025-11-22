'use client';

import { useState } from 'react';
import { useApp } from '@/context/app-provider';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BloodType } from '@/lib/types';
import { forecastSupply, ForecastSupplyOutput } from '@/ai/flows/forecast-supply-flow';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, ShieldCheck, TrendingUp, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

const riskConfig = {
  Low: {
    icon: ShieldCheck,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    title: 'Low Risk',
  },
  Medium: {
    icon: AlertTriangle,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    title: 'Medium Risk',
  },
  High: {
    icon: AlertTriangle,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    title: 'High Risk',
  },
};

export default function AiSupplyForecastingPage() {
  const { inventory } = useApp();
  const [selectedBloodType, setSelectedBloodType] = useState<BloodType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [forecast, setForecast] = useState<ForecastSupplyOutput | null>(null);

  const handleForecast = async () => {
    if (!selectedBloodType) return;

    setIsLoading(true);
    setForecast(null);
    try {
      const result = await forecastSupply({
        bloodType: selectedBloodType,
        inventory: inventory,
      });
      setForecast(result);
    } catch (error) {
      console.error('Error fetching forecast:', error);
      // You could add a toast notification here to inform the user
    } finally {
      setIsLoading(false);
    }
  };

  const RiskDisplay = forecast ? riskConfig[forecast.shortageRisk] : null;

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="AI Supply Forecasting"
        description="Predict potential blood supply shortages using AI analysis."
      />
      <Card className="mt-8 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Select Blood Type</CardTitle>
          <CardDescription>
            Choose a blood type to analyze the current inventory and forecast shortage risk.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Select
              onValueChange={(value: BloodType) => setSelectedBloodType(value)}
              disabled={isLoading}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select blood type" />
              </SelectTrigger>
              <SelectContent>
                {(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as BloodType[]).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleForecast} disabled={!selectedBloodType || isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <BrainCircuit className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Get Forecast
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <Card className="mt-8 max-w-2xl mx-auto">
            <CardHeader>
                <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
            </CardContent>
        </Card>
      )}

      {forecast && RiskDisplay && (
        <Card className={cn("mt-8 max-w-2xl mx-auto", RiskDisplay.bgColor)}>
          <CardHeader>
            <CardTitle className={cn("flex items-center gap-2", RiskDisplay.color)}>
              <RiskDisplay.icon className="h-6 w-6" />
              <span>{RiskDisplay.title} of Shortage for {selectedBloodType}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/80">{forecast.reason}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
