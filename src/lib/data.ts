import { subDays, subHours } from 'date-fns';
import type { BloodInventory, UrgentRequest, DonationCamp, Donor } from './types';

export const INITIAL_INVENTORY: BloodInventory[] = [
  { id: '1', bloodType: 'A+', quantity: 25, location: 'D Y Patil Hospital, Nerul', status: 'Available' },
  { id: '2', bloodType: 'O-', quantity: 8, location: 'Apollo Hospital, Belapur', status: 'Low' },
  { id: '3', bloodType: 'B+', quantity: 3, location: 'MGM Hospital, Vashi', status: 'Critical' },
  { id: '4', bloodType: 'AB+', quantity: 15, location: 'Fortis Hiranandani Hospital, Vashi', status: 'Available' },
  { id: '5', bloodType: 'A-', quantity: 12, location: 'D Y Patil Hospital, Nerul', status: 'Available' },
  { id: '6', bloodType: 'O+', quantity: 50, location: 'Apollo Hospital, Belapur', status: 'Available' },
  { id: '7', bloodType: 'B-', quantity: 5, location: 'MGM Hospital, Vashi', status: 'Critical' },
  { id: '8', bloodType: 'AB-', quantity: 9, location: 'Fortis Hiranandani Hospital, Vashi', status: 'Low' },
];

export const INITIAL_REQUESTS: UrgentRequest[] = [
  { id: 'req1', bloodType: 'O-', quantity: 5, urgency: 'Critical', hospitalName: 'City General Hospital', hospitalLocation: 'Mumbai', broadcastRadius: 10, createdAt: subHours(new Date(), 2).toISOString(), status: 'Active' },
  { id: 'req2', bloodType: 'A+', quantity: 10, urgency: 'High', hospitalName: 'Metro Health Center', hospitalLocation: 'Pune', broadcastRadius: 5, createdAt: subHours(new Date(), 15).toISOString(), status: 'Active' },
  { id: 'req3', bloodType: 'B+', quantity: 8, urgency: 'Moderate', hospitalName: 'Sunshine Medical', hospitalLocation: 'Nagpur', broadcastRadius: 10, createdAt: subDays(new Date(), 2).toISOString(), status: 'Fulfilled', fulfilledBy: 'Anjali Sharma' },
  { id: 'req4', bloodType: 'AB-', quantity: 3, urgency: 'Critical', hospitalName: 'Hope County Hospital', hospitalLocation: 'Mumbai', broadcastRadius: 5, createdAt: subDays(new Date(), 5).toISOString(), status: 'Expired' },
];

export const INITIAL_CAMPS: DonationCamp[] = [
  { id: 'camp1', name: 'Annual Blood Drive', organizer: 'Red Cross Society', location: 'Shivaji Park, Mumbai', address: "Shivaji Park, Dadar, Mumbai, Maharashtra 400028", lat: 19.0232, lng: 72.8421, date: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(), timings: '9:00 AM - 5:00 PM' },
  { id: 'camp2', name: 'Tech Park Donation Day', organizer: 'Infosys Foundation', location: 'Hinjewadi IT Park, Pune', address: "Rajiv Gandhi Infotech Park, Hinjawadi, Pune, Maharashtra 411057", lat: 18.5842, lng: 73.7360, date: new Date(new Date().setDate(new Date().getDate() + 25)).toISOString(), timings: '10:00 AM - 4:00 PM' },
  { id: 'camp3', name: 'Community Health Camp', organizer: 'Lions Club', location: 'Gandhibagh, Nagpur', address: "Gandhibagh, Nagpur, Maharashtra 440002", lat: 21.1466, lng: 79.0882, date: new Date(new Date().setDate(new Date().getDate() + 40)).toISOString(), timings: '11:00 AM - 6:00 PM' },
];

export const INITIAL_DONORS: Donor[] = [
  { id: 'don1', name: 'Rohan Sharma', bloodType: 'O+', location: 'Mumbai, MH', lastDonationDate: subDays(new Date(), 90).toISOString(), contact: { phone: '+919876543210', email: 'rohan.s@example.com' } },
  { id: 'don2', name: 'Priya Mehta', bloodType: 'A+', location: 'Pune, MH', lastDonationDate: subDays(new Date(), 120).toISOString(), contact: { phone: '+919123456789', email: 'priya.m@example.com' } },
  { id: 'don3', name: 'Amit Singh', bloodType: 'B-', location: 'Nagpur, MH', lastDonationDate: subDays(new Date(), 50).toISOString(), contact: { phone: '+919988776655', email: 'amit.s@example.com' } },
  { id: 'don4', name: 'Sunita Patel', bloodType: 'AB+', location: 'Mumbai, MH', lastDonationDate: subDays(new Date(), 200).toISOString(), contact: { phone: '+919654321098', email: 'sunita.p@example.com' } },
  { id: 'don5', name: 'Vikram Reddy', bloodType: 'O-', location: 'Pune, MH', lastDonationDate: subDays(new Date(), 75).toISOString(), contact: { phone: '+919000011111', email: 'vikram.r@example.com' } },
];
