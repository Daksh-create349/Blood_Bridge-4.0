'use client';

import { useState, useEffect, useRef }from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useApp } from '@/context/app-provider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { UrgentRequest, Hospital } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const donationSchema = z.object({
  donorName: z.string().min(1, 'Please enter your name.'),
  purpose: z.string().min(1, 'Please provide a purpose for your donation.'),
});

interface DonationDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  request: UrgentRequest;
}

export function DonationDialog({ isOpen, onOpenChange, request }: DonationDialogProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { fulfillRequest, hospitals } = useApp();
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any | null>(null);

  const form = useForm<z.infer<typeof donationSchema>>({
    resolver: zodResolver(donationSchema),
  });

  const selectedHospital = hospitals.find(h => h.id === selectedHospitalId);

  useEffect(() => {
    if (isOpen && selectedHospital && mapContainerRef.current) {
        const timer = setTimeout(() => {
            if (mapContainerRef.current && !mapRef.current) {
                import('leaflet').then(L => {
                    import('leaflet/dist/leaflet.css');
                    const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
                    const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
                    const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

                    const defaultIcon = L.icon({
                        iconRetinaUrl,
                        iconUrl,
                        shadowUrl,
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        tooltipAnchor: [16, -28],
                        shadowSize: [41, 41],
                    });
                    L.Marker.prototype.options.icon = defaultIcon;

                    mapRef.current = L.map(mapContainerRef.current!).setView([selectedHospital.lat, selectedHospital.lng], 15);

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(mapRef.current);

                    L.marker([selectedHospital.lat, selectedHospital.lng]).addTo(mapRef.current);

                    setTimeout(() => {
                        mapRef.current.invalidateSize();
                    }, 100);
                });
            }
        }, 100);
        return () => clearTimeout(timer);
    }

    if (!isOpen || !selectedHospital) {
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }
    }
}, [isOpen, selectedHospital]);


  function handleConfirmDonation(values: z.infer<typeof donationSchema>) {
    if (request.status !== 'Active') {
      toast({
        variant: 'destructive',
        title: 'Request No Longer Active',
        description: 'This request has already been fulfilled or has expired.',
      });
      handleClose();
      return;
    }
    fulfillRequest(request.id, values.donorName);
    handleClose();
  }

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(1);
      setIsLoading(false);
      setSelectedHospitalId(null);
      form.reset();
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle>Select Hospital</DialogTitle>
              <DialogDescription>
                Choose a hospital where you would like to donate for the request of {request.bloodType}.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <Select onValueChange={setSelectedHospitalId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a hospital" />
                    </SelectTrigger>
                    <SelectContent>
                        {hospitals.map(hospital => (
                            <SelectItem key={hospital.id} value={hospital.id}>
                                {hospital.name} ({hospital.location})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {selectedHospital && (
                    <Card>
                        <CardContent className="pt-4">
                            <div ref={mapContainerRef} className="h-48 w-full rounded-md z-0" />
                        </CardContent>
                    </Card>
                )}
            </div>
            <DialogFooter>
                <Button onClick={() => setStep(2)} disabled={!selectedHospital}>Next</Button>
            </DialogFooter>
          </>
        )}
        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Your Donation</DialogTitle>
              <DialogDescription>
                You are donating to {selectedHospital?.name}. Please provide your details.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleConfirmDonation)} className="space-y-4 py-4">
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
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose of Donating</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Responding to urgent request" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.formState.errors.root && (
                  <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>
                )}
                <DialogFooter>
                    <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirming...</> : 'Confirm Donation'}
                    </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
