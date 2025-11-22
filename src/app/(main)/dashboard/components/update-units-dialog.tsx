'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { BloodInventory } from '@/lib/types';
import { useApp } from '@/context/app-provider';
import { toast } from '@/hooks/use-toast';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

const updateSchema = z.object({
  quantity: z.coerce.number().min(0, 'Quantity must be a positive number'),
});

interface UpdateUnitsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  resource: BloodInventory;
}

export function UpdateUnitsDialog({ isOpen, onOpenChange, resource }: UpdateUnitsDialogProps) {
  const [step, setStep] = useState(1); // 1 for login, 2 for update
  const { updateInventory, hospitals } = useApp();

  const hospital = hospitals.find(h => h.id === resource.hospitalId);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const updateForm = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
    defaultValues: { quantity: resource.quantity },
  });

  function handleLogin(values: z.infer<typeof loginSchema>) {
    // Mock login - in a real app, this would be an API call
    if (values.username === 'admin' && values.password === 'password') {
      setStep(2);
      toast({ title: 'Login successful', description: `Authenticated for ${hospital?.name}` });
    } else {
      loginForm.setError('root', { message: 'Invalid credentials. Use admin/password.' });
    }
  }

  function handleUpdate(values: z.infer<typeof updateSchema>) {
    updateInventory(resource.id, values.quantity);
    handleClose();
  }
  
  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
        setStep(1);
        loginForm.reset();
        updateForm.reset({ quantity: resource.quantity });
    }, 300);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle>Admin Login</DialogTitle>
              <DialogDescription>
                Enter credentials to update inventory for {hospital?.name}.
              </DialogDescription>
            </DialogHeader>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4 py-4">
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="admin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {loginForm.formState.errors.root && (
                  <p className="text-sm font-medium text-destructive">{loginForm.formState.errors.root.message}</p>
                )}
                 <DialogFooter>
                    <Button type="submit" disabled={loginForm.formState.isSubmitting}>
                        {loginForm.formState.isSubmitting ? 'Authenticating...' : 'Login'}
                    </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle>Update {resource.bloodType} Units</DialogTitle>
              <DialogDescription>
                Set the new quantity for {hospital?.name}. Current: {resource.quantity}.
              </DialogDescription>
            </DialogHeader>
            <Form {...updateForm}>
              <form onSubmit={updateForm.handleSubmit(handleUpdate)} className="space-y-4 py-4">
                <FormField
                  control={updateForm.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="secondary" onClick={() => setStep(1)}>Back</Button>
                  <Button type="submit" disabled={updateForm.formState.isSubmitting}>
                    {updateForm.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
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
