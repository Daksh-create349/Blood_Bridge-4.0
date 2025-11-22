'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useApp } from '@/context/app-provider';
import { forecastSupply } from '@/ai/flows/forecast-supply-flow';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BloodType } from '@/lib/types';
import { Loader2, Lightbulb, TrendingUp, TrendingDown } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const forecastSchema = z.object({
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
    required_error: "Please select a blood type to forecast.",
  }),
});

type ForecastResult = {
  shortageRisk: 'Low' | 'Medium' | 'High';
  reason: string;
};

const riskConfig = {
  Low: {
    icon: TrendingUp,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    title: 'Low Risk',
  },
  Medium: {
    icon: TrendingUp,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    title: 'Medium Risk',
  },
  High: {
    icon: TrendingDown,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    title: 'High Risk',
  },
};

export default function AISupplyForecastingPage() {
  const { inventory } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ForecastResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof forecastSchema>>({
    resolver: zodResolver(forecastSchema),
  });

  async function onSubmit(values: z.infer<typeof forecastSchema>) {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const forecastResult = await forecastSupply({
        bloodType: values.bloodType,
        inventory: inventory,
      });
      setResult(forecastResult);
    } catch (e) {
      console.error(e);
      setError('An error occurred while generating the forecast. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="AI Supply Forecasting"
        description="Predict potential shortages using AI-powered analysis."
      />

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Analyze Shortage Risk</CardTitle>
            <CardDescription>Select a blood type to analyze the current inventory and forecast potential risks.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="bloodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a blood type..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as BloodType[]).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Generate Forecast'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center">
          {isLoading && (
             <Card className="w-full h-full flex flex-col items-center justify-center bg-muted/50">
                <Loader2 className="h-12 w-12 text-primary animate-spin"/>
                <p className="mt-4 text-muted-foreground">AI is analyzing the data...</p>
             </Card>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Analysis Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Card className="w-full animate-fade-in">
              <CardHeader>
                 <CardTitle className="flex items-center gap-3">
                  <Lightbulb className="h-6 w-6 text-primary" />
                  Forecast Result
                </CardTitle>
                <CardDescription>Analysis for blood type: {form.getValues('bloodType')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`p-6 rounded-lg flex flex-col items-center justify-center ${riskConfig[result.shortageRisk].bgColor}`}>
                    {React.createElement(riskConfig[result.shortageRisk].icon, { className: `h-16 w-16 ${riskConfig[result.shortageRisk].color}`})}
                    <p className={`mt-4 text-2xl font-bold ${riskConfig[result.shortageRisk].color}`}>{riskConfig[result.shortageRisk].title}</p>
                </div>
                 <Alert>
                    <AlertTitle className="font-semibold">AI-Generated Reason</AlertTitle>
                    <AlertDescription>{result.reason}</AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter>
                 <p className="text-xs text-muted-foreground">This forecast is based on current inventory levels and may change.</p>
              </CardFooter>
            </Card>
          )}

           {!isLoading && !result && !error && (
             <Card className="w-full h-full flex flex-col items-center justify-center border-dashed">
                <Lightbulb className="h-12 w-12 text-muted-foreground/50"/>
                <p className="mt-4 text-muted-foreground">Your forecast results will appear here.</p>
             </Card>
           )}
        </div>
      </div>
       <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
