'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { DonationCamp } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

// Fix for default icon path issue with webpack
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

// Haversine distance calculation
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};


interface CampsMapProps {
  camps: DonationCamp[];
  onRegisterClick: (camp: DonationCamp) => void;
}

const UserLocationMarker = ({ setView }: { setView: boolean }) => {
    const map = useMap();
    const [position, setPosition] = useState<L.LatLng | null>(null);

    useEffect(() => {
        map.locate().on('locationfound', function (e) {
            setPosition(e.latlng);
            if (setView) {
                map.flyTo(e.latlng, 13);
            }
        });
    }, [map, setView]);

    return position === null ? null : (
        <Marker position={position}>
            <Popup>You are here</Popup>
        </Marker>
    );
};

export function CampsMap({ camps, onRegisterClick }: CampsMapProps) {
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  const sortedCamps = useMemo(() => {
    if (!userLocation) return camps;
    return [...camps].sort((a, b) => {
      const distA = getDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
      const distB = getDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
      return distA - distB;
    });
  }, [camps, userLocation]);

  const nearestCamps = sortedCamps.slice(0, 5); // Show nearest 5 camps for example

  return (
    <MapContainer center={[19.0760, 72.8777]} zoom={10} style={{ height: '100%', width: '100%' }}>
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Standard View">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite View">
          <TileLayer
            url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          />
        </LayersControl.BaseLayer>
      </LayersControl>
      
      <UserLocationMarker setView={!!userLocation} />

      {(userLocation ? nearestCamps : camps).map((camp) => (
        <Marker key={camp.id} position={[camp.lat, camp.lng]}>
          <Popup>
            <div className="p-1 w-60">
              <h3 className="font-bold font-headline">{camp.name}</h3>
              <p className="text-sm text-muted-foreground">{camp.location}</p>
              <p className="text-sm mt-1">{format(new Date(camp.date), 'EEE, dd MMM yyyy')}</p>
              <Button size="sm" className="mt-2 w-full" onClick={() => onRegisterClick(camp)}>
                Register
              </Button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
