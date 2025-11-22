'use client';

import { useState } from 'react';
import { useForm, zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useApp } from '@/context/app-provider';
import { suggestOptimalDonationLocations, SuggestOptimalDonationLocationsOutput } from '@/ai/flows/suggest-optimal-donation-locations';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { BloodType, UrgentRequest } from '@/lib/types';
import { Loader2, Sparkles, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const donorSchema = z.object({
  donorBloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], { required_error: "Please select your blood type." }),
  donorName: z.string().min(1, 'Please enter your name.'),
});

interface DonationDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  request: UrgentRequest;
  allRequests: UrgentRequest[];
}

export function DonationDialog({ isOpen, onOpenChange, request, allRequests }: DonationDialogProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestOptimalDonationLocationsOutput>([]);
  const { fulfillRequest } = useApp();
  const [selectedHospital, setSelectedHospital] = useState('');

  const form = useForm<z.infer<typeof donorSchema>>({
    resolver: zodResolver(donorSchema),
    defaultValues: { donorBloodType: request.bloodType },
  });

  async function getSuggestions(values: z.infer<typeof donorSchema>) {
    setIsLoading(true);
    try {
      const activeRequests = allRequests
        .filter(r => r.status === 'Active')
        .map(r => ({
          hospitalName: r.hospitalName,
          hospitalLocation: r.hospitalLocation,
          bloodTypeNeeded: r.bloodType,
          quantityRequested: r.quantity,
          urgency: r.urgency,
        }));
      
      const result = await suggestOptimalDonationLocations({
        donorBloodType: values.donorBloodType,
        activeRequests: activeRequests,
      });

      setSuggestions(result);
      setStep(2);
    } catch (error) {
      console.error("AI suggestion failed:", error);
      form.setError('root', { message: 'Could not get suggestions. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }

  function handleConfirmDonation() {
    if (!selectedHospital) return;
    const donorName = form.getValues('donorName');
    fulfillRequest(request.id, donorName);
    handleClose();
  }

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(1);
      setIsLoading(false);
      setSuggestions([]);
      setSelectedHospital('');
      form.reset({ donorBloodType: request.bloodType });
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Your Donation</DialogTitle>
              <DialogDescription>
                Provide your details to find the best place to donate for the request of {request.bloodType}.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(getSuggestions)} className="space-y-4 py-4">
                 <FormField
                  control={form.control}
                  name="donorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="donorBloodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Blood Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select your blood type" /></SelectTrigger>
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
                {form.formState.errors.root && (
                  <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>
                )}
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</> : <><Sparkles className="mr-2 h-4 w-4" />Get AI Suggestions</>}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Sparkles className="text-primary h-5 w-5" /> AI Recommended Locations</DialogTitle>
              <DialogDescription>
                Our AI suggests these locations for maximum impact. Please select one to confirm.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-80 overflow-y-auto">
              {suggestions.map((s, index) => (
                <Card 
                  key={index} 
                  className={`cursor-pointer transition-all ${selectedHospital === s.hospitalName ? 'border-primary ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedHospital(s.hospitalName)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{s.hospitalName}</h4>
                        <p className="text-sm text-muted-foreground">{s.hospitalLocation}</p>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-4 w-4" />
                        <span className="font-bold">{s.priorityScore.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{s.reason}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={handleConfirmDonation} disabled={!selectedHospital}>Confirm Donation</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
