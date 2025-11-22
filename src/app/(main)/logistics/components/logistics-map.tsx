'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { Truck, Package, User, Pin, Flag } from 'lucide-react';

import type { DeliveryVehicle } from '@/lib/types';
import { useApp } from '@/context/app-provider';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// Fix for default icon path issue
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

const statusColors: { [key in DeliveryVehicle['status']]: string } = {
  'In Transit': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
  Delayed: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
};

interface LogisticsMapProps {
  initialVehicles: DeliveryVehicle[];
}

export function LogisticsMap({ initialVehicles }: LogisticsMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const vehicleMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const polylinesRef = useRef<Map<string, L.Polyline>>(new Map());

  const { vehicles, updateVehicles } = useApp();

  useEffect(() => {
    const interval = setInterval(() => {
      updateVehicles(prevVehicles => {
        return prevVehicles.map(v => {
          if (v.status === 'In Transit' && v.path.length > 1) {
            const currentPathIndex = v.path.findIndex(
              p => p[0] === v.currentPosition.lat && p[1] === v.currentPosition.lng
            );

            if (currentPathIndex < v.path.length - 1) {
              const nextPoint = v.path[currentPathIndex + 1];
              return {
                ...v,
                currentPosition: { lat: nextPoint[0], lng: nextPoint[1] },
              };
            } else {
              return { ...v, status: 'Delivered' as const };
            }
          }
          return v;
        });
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateVehicles]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current, {
      center: [19.5, 75.5], // Center of Maharashtra
      zoom: 7,
      scrollWheelZoom: true,
    });

    const standardLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current);

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
    });

    L.control.layers({ 'Standard': standardLayer, 'Satellite': satelliteLayer }).addTo(mapRef.current);
    
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Draw paths and markers
    vehicles.forEach(vehicle => {
      // Draw path
      if (!polylinesRef.current.has(vehicle.id)) {
        const polyline = L.polyline(vehicle.path, { color: 'gray', dashArray: '5, 5' }).addTo(map);
        polylinesRef.current.set(vehicle.id, polyline);
      }

      // Origin and destination markers
      const originIcon = L.divIcon({
          className: 'custom-div-icon',
          html: renderToStaticMarkup(<Pin className="text-green-500" />),
          iconSize: [24, 24],
          iconAnchor: [12, 24]
      });
      L.marker([vehicle.origin.lat, vehicle.origin.lng], { icon: originIcon }).addTo(map).bindPopup(`Origin: ${vehicle.origin.name}`);

      const destIcon = L.divIcon({
          className: 'custom-div-icon',
          html: renderToStaticMarkup(<Flag className="text-red-500" />),
          iconSize: [24, 24],
          iconAnchor: [0, 24]
      });
      L.marker([vehicle.destination.lat, vehicle.destination.lng], { icon: destIcon }).addTo(map).bindPopup(`Destination: ${vehicle.destination.name}`);

      // Vehicle marker
      const truckIcon = L.divIcon({
        className: 'custom-div-icon',
        html: renderToStaticMarkup(<Truck className={cn("h-6 w-6 transform transition-transform duration-1000 ease-linear", vehicle.status === 'In Transit' ? 'text-primary' : 'text-muted-foreground')} />),
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const popupContent = renderToStaticMarkup(
        <div className="p-1 w-60 space-y-2">
            <div className="flex justify-between items-start">
                <h3 className="font-bold font-headline">{vehicle.vehicleId}</h3>
                <Badge variant="outline" className={cn(statusColors[vehicle.status])}>{vehicle.status}</Badge>
            </div>
          <div className="text-sm space-y-1">
            <p className="flex items-center gap-2"><User /> {vehicle.driverName}</p>
            <p className="flex items-center gap-2"><Package /> {vehicle.units} units of {vehicle.bloodType}</p>
          </div>
        </div>
      );

      const marker = vehicleMarkersRef.current.get(vehicle.id);
      if (marker) {
        if (vehicle.status === 'In Transit') {
            marker.setLatLng([vehicle.currentPosition.lat, vehicle.currentPosition.lng]);
        }
        marker.setIcon(truckIcon); // Update icon in case status changes
        marker.setPopupContent(popupContent);
      } else {
        const newMarker = L.marker([vehicle.currentPosition.lat, vehicle.currentPosition.lng], { icon: truckIcon })
          .addTo(map)
          .bindPopup(popupContent);
        vehicleMarkersRef.current.set(vehicle.id, newMarker);
      }
    });

  }, [vehicles]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
}
