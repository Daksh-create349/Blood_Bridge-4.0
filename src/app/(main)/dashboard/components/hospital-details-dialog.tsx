'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Hospital as HospitalIcon, MapPin, Phone, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Hospital } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

// Fix for default icon path issue with webpack
if (typeof window !== 'undefined') {
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
}

interface HospitalDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  hospital: Hospital | null;
}

export function HospitalDetailsDialog({ isOpen, onOpenChange, hospital }: HospitalDetailsDialogProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!isOpen || !hospital || !mapContainerRef.current) return;

    // If map is already initialized, just update its view
    if (mapRef.current) {
        mapRef.current.flyTo([hospital.lat, hospital.lng], 15);
        // Clear old markers and add new one
        mapRef.current.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                layer.remove();
            }
        });
        L.marker([hospital.lat, hospital.lng]).addTo(mapRef.current).bindPopup(hospital.name).openPopup();
        return;
    }

    // Initialize map
    mapRef.current = L.map(mapContainerRef.current, {
      center: [hospital.lat, hospital.lng],
      zoom: 15,
      scrollWheelZoom: false,
    });

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }
    ).addTo(mapRef.current);
    
    L.marker([hospital.lat, hospital.lng]).addTo(mapRef.current).bindPopup(hospital.name).openPopup();

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isOpen, hospital]);

  if (!hospital) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
            <HospitalIcon className="h-6 w-6 text-primary" />
            {hospital.name}
          </DialogTitle>
          <DialogDescription>
            {hospital.location}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div ref={mapContainerRef} className="h-64 w-full rounded-md border" />
          <div className="space-y-3 text-sm">
            <div className="flex items-start">
              <MapPin className="mr-3 h-4 w-4 flex-shrink-0 text-muted-foreground mt-0.5" />
              <span className="flex-1">{hospital.address}</span>
            </div>
            <div className="flex items-center">
              <Phone className="mr-3 h-4 w-4 text-muted-foreground" />
              <a href={`tel:${hospital.contact}`} className="text-primary hover:underline">{hospital.contact}</a>
            </div>
             <div className="flex items-center">
              <Star className="mr-3 h-4 w-4 text-yellow-400" />
              <span>
                <span className="font-bold">{hospital.rating}</span> / 5.0 rating
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
