'use client';

import React, { createContext, useContext } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { INITIAL_INVENTORY, INITIAL_REQUESTS, INITIAL_CAMPS, INITIAL_DONORS } from '@/lib/data';
import type { BloodInventory, UrgentRequest, DonationCamp, Donor, CampRegistrant, AppContextType, AppState } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [inventory, setInventory] = useLocalStorage<BloodInventory[]>('blood-inventory', INITIAL_INVENTORY);
  const [requests, setRequests] = useLocalStorage<UrgentRequest[]>('urgent-requests', INITIAL_REQUESTS);
  const [camps] = useLocalStorage<DonationCamp[]>('donation-camps', INITIAL_CAMPS);
  const [donors] = useLocalStorage<Donor[]>('donors', INITIAL_DONORS);
  const [registrants, setRegistrants] = useLocalStorage<CampRegistrant[]>('camp-registrants', []);

  const updateInventory = (id: string, newQuantity: number) => {
    setInventory(prevInventory => {
      return prevInventory.map(item => {
        if (item.id === id) {
          let newStatus = item.status;
          if (newQuantity <= 5) newStatus = 'Critical';
          else if (newQuantity <= 10) newStatus = 'Low';
          else newStatus = 'Available';
          return { ...item, quantity: newQuantity, status: newStatus };
        }
        return item;
      });
    });
    toast({
      title: "Inventory Updated",
      description: `Quantity for item ${id} has been set to ${newQuantity}.`,
    })
  };

  const addRequest = (request: Omit<UrgentRequest, 'id' | 'createdAt' | 'status'>) => {
    const newRequest: UrgentRequest = {
      ...request,
      id: `req${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'Active',
    };
    setRequests(prevRequests => [newRequest, ...prevRequests]);
    toast({
        title: "Urgent Request Sent",
        description: `Request for ${request.bloodType} has been broadcasted.`,
    })
  };

  const fulfillRequest = (requestId: string, donorName: string) => {
    setRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === requestId ? { ...req, status: 'Fulfilled', fulfilledBy: donorName } : req
      )
    );
    toast({
        title: "Donation Confirmed",
        description: `Thank you for your commitment to donate!`,
    })
  };

  const registerForCamp = (registration: Omit<CampRegistrant, 'id' | 'ticketId'>) => {
    const newRegistrant: CampRegistrant = {
      ...registration,
      id: `reg${Date.now()}`,
      ticketId: `TICKET-${Date.now()}`,
    };
    setRegistrants(prev => [...prev, newRegistrant]);
    return newRegistrant;
  };


  const value: AppContextType = {
    inventory,
    requests,
    camps,
    donors,
    registrants,
    updateInventory,
    addRequest,
    fulfillRequest,
    registerForCamp: (reg) => {
      const newReg = {
        ...reg,
        id: `reg-${Date.now()}`,
        ticketId: `TICKET-${Date.now()}`
      };
      setRegistrants(prev => [...prev, newReg]);
      return newReg;
    }
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
