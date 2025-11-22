'use client';

import { useState, useEffect } from 'react';
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

interface CampsMapProps {
  camps: DonationCamp[];
  onRegisterClick: (camp: DonationCamp) => void;
}

const UserLocationMarker = () => {
    const map = useMap();
    const [position, setPosition] = useState<L.LatLng | null>(null);

    useEffect(() => {
        map.locate().on('locationfound', function (e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, 13);
        });
    }, [map]);

    return position === null ? null : (
        <Marker position={position}>
            <Popup>You are here</Popup>
        </Marker>
    );
};

export function CampsMap({ camps, onRegisterClick }: CampsMapProps) {

  return (
    <MapContainer center={[19.0760, 72.8777]} zoom={10} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
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
      
      <UserLocationMarker />

      {camps.map((camp) => (
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
