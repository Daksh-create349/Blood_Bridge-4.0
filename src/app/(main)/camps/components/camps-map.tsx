'use client';

import { Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { useState } from 'react';
import { DonationCamp } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface CampsMapProps {
  camps: DonationCamp[];
  onRegisterClick: (camp: DonationCamp) => void;
}

export function CampsMap({ camps, onRegisterClick }: CampsMapProps) {
  const [selectedCampId, setSelectedCampId] = useState<string | null>(null);

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
        <div className="flex items-center justify-center h-full bg-muted">
            <p className="text-muted-foreground">Google Maps API Key is missing.</p>
        </div>
    )
  }

  return (
    <Map
      defaultCenter={{ lat: 19.0760, lng: 72.8777 }}
      defaultZoom={10}
      mapId="blood_bridge_map"
      gestureHandling={'greedy'}
      disableDefaultUI={true}
    >
      {camps.map((camp) => (
        <AdvancedMarker
          key={camp.id}
          position={{ lat: camp.lat, lng: camp.lng }}
          onClick={() => setSelectedCampId(camp.id)}
        >
          <Pin
            background={'hsl(var(--primary))'}
            borderColor={'hsl(var(--primary-foreground))'}
            glyphColor={'hsl(var(--primary-foreground))'}
          />
        </AdvancedMarker>
      ))}
      {selectedCampId && (
        <InfoWindow
          position={camps.find(c => c.id === selectedCampId) ? { lat: camps.find(c => c.id === selectedCampId)!.lat, lng: camps.find(c => c.id === selectedCampId)!.lng } : undefined}
          onCloseClick={() => setSelectedCampId(null)}
        >
          {(() => {
            const camp = camps.find(c => c.id === selectedCampId);
            if (!camp) return null;
            return (
              <div className="p-2 w-64">
                <h3 className="font-bold font-headline">{camp.name}</h3>
                <p className="text-sm text-muted-foreground">{camp.location}</p>
                <p className="text-sm mt-1">{format(new Date(camp.date), 'EEE, dd MMM yyyy')}</p>
                <Button size="sm" className="mt-2 w-full" onClick={() => onRegisterClick(camp)}>
                  Register
                </Button>
              </div>
            );
          })()}
        </InfoWindow>
      )}
    </Map>
  );
}
