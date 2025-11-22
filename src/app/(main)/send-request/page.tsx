'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useApp } from '@/context/app-provider';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BloodType, UrgencyLevel } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

const requestSchema = z.object({
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
    required_error: "Blood type is required.",
  }),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1 unit.'),
  urgency: z.enum(["Critical", "High", "Moderate"], {
    required_error: "Urgency level is required.",
  }),
  hospitalName: z.string().min(1, 'Hospital name is required.'),
  hospitalLocation: z.string().min(1, 'Hospital location is required.'),
  broadcastRadius: z.enum(['5', '10', '15']),
});

export default function SendRequestPage() {
  const router = useRouter();
  const { addRequest } = useApp();

  const form = useForm<z.infer<typeof requestSchema>>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      quantity: 1,
      broadcastRadius: '10',
    },
  });

  function onSubmit(values: z.infer<typeof requestSchema>) {
    addRequest({
      ...values,
      broadcastRadius: parseInt(values.broadcastRadius, 10),
    });
    toast({
      title: 'Request Broadcasted',
      description: 'Your urgent request has been sent out.',
    });
    router.push('/view-alerts');
  }

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Send Urgent Request"
        description="Broadcast a new request for blood supplies to nearby donors and banks."
      />
      <Card className="mt-8 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>New Request Details</CardTitle>
          <CardDescription>Fill out the form below to create a new urgent request.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="bloodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select blood type" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as BloodType[]).map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity (units)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="urgency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Urgency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select urgency level" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(["Critical", "High", "Moderate"] as UrgencyLevel[]).map(level => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hospitalName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hospital Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., City General Hospital" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hospitalLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hospital Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Mumbai, MH" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="broadcastRadius"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Broadcast Radius</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex items-center space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl><RadioGroupItem value="5" /></FormControl>
                          <FormLabel className="font-normal">5 km</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl><RadioGroupItem value="10" /></FormControl>
                          <FormLabel className="font-normal">10 km</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl><RadioGroupItem value="15" /></FormControl>
                          <FormLabel className="font-normal">15 km</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Broadcasting..." : "Broadcast Request"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
