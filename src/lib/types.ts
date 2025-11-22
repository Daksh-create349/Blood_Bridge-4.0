export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
export type ResourceStatus = "Available" | "Low" | "Critical";
export type UrgencyLevel = "Critical" | "High" | "Moderate";
export type RequestStatus = "Active" | "Fulfilled" | "Expired";

export interface BloodInventory {
  id: string;
  bloodType: BloodType;
  quantity: number; // in units
  location: string;
  status: ResourceStatus;
};

export interface UrgentRequest {
  id: string;
  bloodType: BloodType;
  quantity: number;
  urgency: UrgencyLevel;
  hospitalName: string;
  hospitalLocation: string;
  broadcastRadius: number; // in km
  createdAt: string; // ISO date string
  status: RequestStatus;
  fulfilledBy?: string;
};

export interface DonationCamp {
  id: string;
  name: string;
  organizer: string;
  location: string;
  address: string;
  lat: number;
  lng: number;
  date: string; // ISO date string
  timings: string;
};

export interface Donor {
  id:string;
  name: string;
  bloodType: BloodType;
  location: string;
  lastDonationDate: string; // ISO date string
  contact: {
    phone: string;
    email: string;
  }
};

export interface CampRegistrant {
  id: string;
  fullName: string;
  age: number;
  idProof: File | null;
  photo: string; // data URL
  campId: string;
  ticketId: string;
}

// Context types
export interface AppState {
  inventory: BloodInventory[];
  requests: UrgentRequest[];
  camps: DonationCamp[];
  donors: Donor[];
  registrants: CampRegistrant[];
}

export interface AppContextType extends AppState {
  updateInventory: (id: string, newQuantity: number) => void;
  addRequest: (request: Omit<UrgentRequest, 'id' | 'createdAt' | 'status'>) => void;
  fulfillRequest: (requestId: string, donorName: string) => void;
  registerForCamp: (registration: Omit<CampRegistrant, 'id' | 'ticketId'>) => void;
}
