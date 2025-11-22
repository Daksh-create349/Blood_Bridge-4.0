'use client';

import { useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toPng } from 'html-to-image';
import { useApp } from '@/context/app-provider';
import { DonationCamp, CampRegistrant } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import Webcam from 'react-webcam';
import { Camera, RefreshCcw, Ticket, Download } from 'lucide-react';
import QRCode from 'qrcode.react';

const detailsSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  age: z.coerce.number().min(18, 'You must be at least 18 years old.').max(65, 'You must be at most 65 years old.'),
  idProof: z.any().refine((files) => files?.length === 1, 'ID proof is required.'),
});

interface RegistrationDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  camp: DonationCamp;
}

const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: "user"
};

export function RegistrationDialog({ isOpen, onOpenChange, camp }: RegistrationDialogProps) {
  const [step, setStep] = useState(1);
  const [image, setImage] = useState<string | null>(null);
  const [registrant, setRegistrant] = useState<CampRegistrant | null>(null);
  const { registerForCamp } = useApp();
  const ticketRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof detailsSchema>>({
    resolver: zodResolver(detailsSchema),
  });

  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
    }
  }, [webcamRef]);
  
  function onDetailsSubmit(values: z.infer<typeof detailsSchema>) {
    setStep(2);
  }

  function handleCapturePhoto() {
    if (!image) {
      toast({ variant: 'destructive', title: 'No Photo Captured', description: 'Please capture a photo before proceeding.' });
      return;
    }
    const formValues = form.getValues();
    const newRegistrant = registerForCamp({
      fullName: formValues.fullName,
      age: formValues.age,
      idProof: formValues.idProof[0],
      photo: image,
      campId: camp.id
    });
    setRegistrant(newRegistrant);
    setStep(3);
    toast({ title: 'Registration Successful!', description: 'Your participation ticket has been generated.' });
  }

  const downloadTicket = useCallback(() => {
    if (ticketRef.current === null) {
      return;
    }

    toPng(ticketRef.current, { cacheBust: true, })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `BloodBridge-Ticket-${registrant?.ticketId}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error(err)
        toast({ variant: 'destructive', title: 'Download Failed', description: 'Could not download your ticket.' });
      })
  }, [ticketRef, registrant]);

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
        setStep(1);
        setImage(null);
        form.reset();
    }, 300);
  }

  const progressValue = (step / 3) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Register for {camp.name}</DialogTitle>
          <DialogDescription>Complete the steps below to secure your spot.</DialogDescription>
        </DialogHeader>
        <Progress value={progressValue} className="w-full mt-2" />

        {step === 1 && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onDetailsSubmit)} className="space-y-4 py-4">
              <h3 className="font-semibold">Step 1: Your Details</h3>
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => <FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>}
              />
              <FormField
                control={form.control}
                name="idProof"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>ID Proof</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/*,.pdf" onChange={e => onChange(e.target.files)} {...rest} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Next: Capture Photo</Button>
              </DialogFooter>
            </form>
          </Form>
        )}

        {step === 2 && (
          <div className="py-4">
            <h3 className="font-semibold mb-4">Step 2: Capture Photo</h3>
            <div className="rounded-md overflow-hidden border">
                {image ? <img src={image} alt="Captured" /> : <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={videoConstraints} />}
            </div>
            <div className="flex justify-center gap-4 mt-4">
                {image ? (
                    <Button variant="outline" onClick={() => setImage(null)}><RefreshCcw className="mr-2 h-4 w-4" /> Retake</Button>
                ) : (
                    <Button onClick={capture}><Camera className="mr-2 h-4 w-4" /> Capture</Button>
                )}
            </div>
            <DialogFooter className="mt-6">
              <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={handleCapturePhoto} disabled={!image}>Next: Generate Ticket</Button>
            </DialogFooter>
          </div>
        )}
        
        {step === 3 && registrant && (
          <div className="py-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Ticket className="h-5 w-5 text-primary"/> Step 3: Your Participation Ticket</h3>
             <div ref={ticketRef} className="p-4 border rounded-lg bg-background">
                <div className="flex gap-4">
                    <img src={registrant.photo} alt="Participant" className="w-24 h-24 rounded-md object-cover" />
                    <div className="flex-1">
                        <p className="font-bold text-lg">{registrant.fullName}</p>
                        <p className="text-sm text-muted-foreground">Age: {registrant.age}</p>
                        <p className="text-sm text-muted-foreground">Ticket ID: {registrant.ticketId}</p>
                    </div>
                    <QRCode value={JSON.stringify({ ticketId: registrant.ticketId, name: registrant.fullName })} size={80} />
                </div>
                <div className="border-t my-4"></div>
                <div>
                    <p className="font-semibold">{camp.name}</p>
                    <p className="text-sm text-muted-foreground">{camp.location}</p>
                </div>
            </div>
            <DialogFooter className="mt-6">
                <Button onClick={downloadTicket}><Download className="mr-2 h-4 w-4" /> Download Ticket</Button>
            </DialogFooter>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
