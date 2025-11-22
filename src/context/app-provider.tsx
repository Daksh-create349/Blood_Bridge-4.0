'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { INITIAL_INVENTORY, INITIAL_REQUESTS, INITIAL_CAMPS, INITIAL_DONORS, INITIAL_HOSPITALS, INITIAL_VEHICLES } from '@/lib/data';
import type { Hospital, BloodInventory, UrgentRequest, DonationCamp, Donor, CampRegistrant, DeliveryVehicle, AppContextType, LogisticsEvent } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [inventory, setInventory] = useLocalStorage<BloodInventory[]>('blood-inventory', INITIAL_INVENTORY);
  const [requests, setRequests] = useLocalStorage<UrgentRequest[]>('urgent-requests', INITIAL_REQUESTS);
  const [camps] = useLocalStorage<DonationCamp[]>('donation-camps', INITIAL_CAMPS);
  const [donors] = useLocalStorage<Donor[]>('donors', INITIAL_DONORS);
  const [hospitals] = useLocalStorage<Hospital[]>('hospitals', INITIAL_HOSPITALS);
  const [registrants, setRegistrants] = useLocalStorage<CampRegistrant[]>('camp-registrants', []);
  const [vehicles, setVehicles] = useLocalStorage<DeliveryVehicle[]>('delivery-vehicles', INITIAL_VEHICLES);
  const [logisticsEvents, setLogisticsEvents] = useLocalStorage<LogisticsEvent[]>('logistics-events', []);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const updateInventory = (id: string, newQuantity: number) => {
    setInventory(prevInventory => {
      const updatedInventory = prevInventory.map(item => {
        if (item.id === id) {
          let newStatus = item.status;
          if (newQuantity <= 5) newStatus = 'Critical';
          else if (newQuantity <= 10) newStatus = 'Low';
          else newStatus = 'Available';
          return { ...item, quantity: newQuantity, status: newStatus };
        }
        return item;
      });
      return updatedInventory;
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
        req.id === requestId ? { ...req, status: 'Fulfilled' as const, fulfilledBy: donorName } : req
      )
    );
    toast({
        title: "Donation Confirmed",
        description: `Thank you, ${donorName}! Your commitment to donate has been recorded.`,
    });
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
  
  const addLogisticsEvent = (message: string, type: LogisticsEvent['type']) => {
    const newEvent: LogisticsEvent = {
      id: `evt-${Date.now()}`,
      message,
      type,
      timestamp: new Date().toISOString(),
    };
    setLogisticsEvents(prevEvents => [newEvent, ...prevEvents].slice(0, 50)); // Keep last 50 events
  };

  const value: AppContextType = {
    inventory,
    requests,
    camps,
    donors,
    hospitals,
    registrants,
    vehicles,
    logisticsEvents,
    updateInventory,
    addRequest,
    fulfillRequest,
    registerForCamp,
    addLogisticsEvent,
    setVehicles,
    isClient,
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
