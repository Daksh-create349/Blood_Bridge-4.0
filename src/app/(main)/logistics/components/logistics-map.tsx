'use client';

import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useApp } from '@/context/app-provider';
import { Hospital } from '@/lib/types';
import { Hospital as HospitalIcon } from 'lucide-react';

// Fix for default icon path issue
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
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

const routeColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFA1'];

const getRandomColor = () => routeColors[Math.floor(Math.random() * routeColors.length)];

export function LogisticsMap() {
  const { hospitals } = useApp();

  const routes = useMemo(() => {
    if (hospitals.length < 2) return [];
    // Create some predefined routes for visualization
    return [
      { from: hospitals[0], to: hospitals[1] },
      { from: hospitals[2], to: hospitals[3] },
      { from: hospitals[4], to: hospitals[8] },
      { from: hospitals[9], to: hospitals[12] },
      { from: hospitals[13], to: hospitals[15] },
      { from: hospitals[5], to: hospitals[6] },
    ].filter(route => route.from && route.to);
  }, [hospitals]);

  const [routeStates, setRouteStates] = useState(() => 
    routes.map(route => ({ ...route, color: getRandomColor() }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRouteStates(prevStates => 
        prevStates.map(route => ({ ...route, color: getRandomColor() }))
      );
    }, 10000); // Change colors every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const center: [number, number] =
    hospitals.length > 0 ? [19.076, 72.8777] : [51.505, -0.09]; // Default to Mumbai or London

  return (
    <MapContainer center={center} zoom={10} scrollWheelZoom={true} className="h-full w-full z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {hospitals.map((hospital: Hospital) => (
        <Marker key={hospital.id} position={[hospital.lat, hospital.lng]}>
          <Popup>
            <div className="font-semibold flex items-center gap-2">
                <HospitalIcon className="h-4 w-4 text-primary" /> {hospital.name}
            </div>
            <p className="text-muted-foreground">{hospital.location}</p>
          </Popup>
        </Marker>
      ))}

      {routeStates.map((route, index) => (
        <Polyline
          key={index}
          positions={[
            [route.from.lat, route.from.lng],
            [route.to.lat, route.to.lng],
          ]}
          pathOptions={{ color: route.color, weight: 5, opacity: 0.7 }}
        />
      ))}
    </MapContainer>
  );
}
