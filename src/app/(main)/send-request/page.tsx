'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useApp } from '@/context/app-provider';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BloodType, UrgencyLevel, Hospital } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { MapPin } from 'lucide-react';

const requestSchema = z.object({
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
    required_error: "Blood type is required.",
  }),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1 unit.'),
  urgency: z.enum(["Critical", "High", "Moderate"], {
    required_error: "Urgency level is required.",
  }),
  hospitalId: z.string().min(1, 'Please select a hospital.'),
  broadcastRadius: z.enum(['5', '10', '15']),
});

export default function SendRequestPage() {
  const router = useRouter();
  const { addRequest, hospitals } = useApp();
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any | null>(null);

  const form = useForm<z.infer<typeof requestSchema>>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      quantity: 1,
      broadcastRadius: '10',
    },
  });

  const selectedHospitalId = form.watch('hospitalId');

  useEffect(() => {
    const hospital = hospitals.find(h => h.id === selectedHospitalId);
    setSelectedHospital(hospital || null);
  }, [selectedHospitalId, hospitals]);

  useEffect(() => {
    if (selectedHospital && mapContainerRef.current) {
        import('leaflet').then(L => {
            if (mapRef.current) {
                mapRef.current.remove();
            }

            const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
            const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
            const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';
            
            const defaultIcon = L.icon({
                iconRetinaUrl, iconUrl, shadowUrl,
                iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
                tooltipAnchor: [16, -28], shadowSize: [41, 41],
            });
            L.Marker.prototype.options.icon = defaultIcon;

            const mapInstance = L.map(mapContainerRef.current!, {
                center: [selectedHospital.lat, selectedHospital.lng],
                zoom: 15,
                scrollWheelZoom: false,
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstance);

            L.marker([selectedHospital.lat, selectedHospital.lng]).addTo(mapInstance);
            
            mapRef.current = mapInstance;

            setTimeout(() => mapInstance.invalidateSize(), 100);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHospital]);


  function onSubmit(values: z.infer<typeof requestSchema>) {
    const hospital = hospitals.find(h => h.id === values.hospitalId);
    if (!hospital) {
        toast({
            variant: 'destructive',
            title: 'Invalid Hospital',
            description: 'Please select a valid hospital from the list.',
        });
        return;
    }

    addRequest({
      bloodType: values.bloodType,
      quantity: values.quantity,
      urgency: values.urgency,
      hospitalName: hospital.name,
      hospitalLocation: hospital.location,
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
               <FormField
                  control={form.control}
                  name="hospitalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hospital</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a hospital" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {hospitals.map(hospital => (
                            <SelectItem key={hospital.id} value={hospital.id}>
                              {hospital.name} ({hospital.location})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedHospital && (
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                        <h4 className="font-semibold">{selectedHospital.name}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4" /> {selectedHospital.location}
                        </p>
                        <div ref={mapContainerRef} className="h-48 w-full rounded-md border mt-4" />
                    </CardContent>
                  </Card>
                )}

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
                <Button type="submit" disabled={form.formState.isSubmitting || !selectedHospital}>
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
