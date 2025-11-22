'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { Truck, Package, User, Pin } from 'lucide-react';

import type { DeliveryVehicle } from '@/lib/types';
import { useApp } from '@/context/app-provider';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { LOGISTICS_EVENT_MESSAGES } from '@/lib/data';

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

export function LogisticsMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const vehicleMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const staticMarkersRef = useRef<L.LayerGroup | null>(null);

  const { vehicles, setVehicles, addLogisticsEvent } = useApp();

  // Main simulation loop for vehicle movement
  useEffect(() => {
    const simulationTick = () => {
      setVehicles(currentVehicles => {
        let vehicleUpdated = false;
        const updatedVehicles = currentVehicles.map(v => {
          if (v.status !== 'In Transit' || !v.deliveryStartTime || !v.deliveryDuration) {
            return v;
          }

          const elapsedTime = Date.now() - v.deliveryStartTime;
          const progress = Math.min(elapsedTime / v.deliveryDuration, 1);
          
          if (progress >= 1) {
            if (v.currentPosition.lat !== v.destination.lat || v.currentPosition.lng !== v.destination.lng) {
              // Delivery just completed
              addLogisticsEvent(LOGISTICS_EVENT_MESSAGES.delivery(v), 'DELIVERY');
              vehicleUpdated = true;
              return {
                ...v,
                status: 'Delivered' as const,
                currentPosition: { lat: v.destination.lat, lng: v.destination.lng }
              };
            }
            return v; // Already delivered, no change
          } else {
            // Update position along path
            const pathIndex = Math.floor(progress * (v.path.length - 1));
            const nextPoint = v.path[pathIndex];
            vehicleUpdated = true;
            return {
              ...v,
              currentPosition: { lat: nextPoint[0], lng: nextPoint[1] },
            };
          }
        });
        
        return vehicleUpdated ? updatedVehicles : currentVehicles;
      });
    };

    const interval = setInterval(simulationTick, 1000); // Animate vehicle position every second
    return () => clearInterval(interval);
  }, [setVehicles, addLogisticsEvent]);

  // Dispatcher loop to start new deliveries
  useEffect(() => {
    const dispatchVehicle = () => {
        setVehicles(currentVehicles => {
            const waitingVehicles = currentVehicles.filter(v => v.status === 'Delivered');
            if (waitingVehicles.length === 0) return currentVehicles;
            
            const vehicleToDispatch = waitingVehicles[Math.floor(Math.random() * waitingVehicles.length)];
            
            addLogisticsEvent(LOGISTICS_EVENT_MESSAGES.dispatch(vehicleToDispatch), 'DISPATCH');

            return currentVehicles.map(v => 
                v.id === vehicleToDispatch.id 
                ? {
                    ...v,
                    status: 'In Transit' as const,
                    currentPosition: { lat: v.origin.lat, lng: v.origin.lng },
                    deliveryStartTime: Date.now(),
                    deliveryDuration: (Math.random() * 3 + 2) * 60 * 1000 // 2 to 5 minutes
                }
                : v
            );
        });
    };

    const interval = setInterval(dispatchVehicle, 20000); // Dispatch a new vehicle every 20 seconds
    const timeoutId = setTimeout(dispatchVehicle, 2000); // Dispatch one almost immediately on load
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, [setVehicles, addLogisticsEvent]);


  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current, {
      center: [19.5, 75.5], // Center of Maharashtra
      zoom: 7,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current);
    
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Draw static markers (origin/destination) once
    if (!staticMarkersRef.current && vehicles.length > 0) {
        staticMarkersRef.current = L.layerGroup().addTo(map);
        const uniqueLocations = new Map<string, {lat: number, lng: number, name: string}>();
        
        vehicles.forEach(v => {
            uniqueLocations.set(v.origin.name, { lat: v.origin.lat, lng: v.origin.lng, name: v.origin.name});
            uniqueLocations.set(v.destination.name, { lat: v.destination.lat, lng: v.destination.lng, name: v.destination.name});
        });

        const originIcon = L.divIcon({
            className: 'custom-div-icon',
            html: renderToStaticMarkup(<Pin className="text-green-500 drop-shadow-lg" />),
            iconSize: [24, 24], iconAnchor: [12, 24]
        });

        uniqueLocations.forEach(loc => {
            L.marker([loc.lat, loc.lng], { icon: originIcon }).addTo(staticMarkersRef.current!).bindPopup(`<b>${loc.name}</b>`);
        })
    }

    // Update vehicle markers
    vehicles.forEach(vehicle => {
      const truckIcon = L.divIcon({
        className: 'custom-div-icon',
        html: renderToStaticMarkup(<Truck className={cn("h-6 w-6 transform transition-transform duration-1000 ease-linear drop-shadow-lg", vehicle.status === 'In Transit' ? 'text-primary' : 'text-muted-foreground/50')} />),
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
      
      // Only show vehicles that are in transit
      if (vehicle.status === 'In Transit') {
        if (marker) {
          marker.setLatLng([vehicle.currentPosition.lat, vehicle.currentPosition.lng]);
          marker.setIcon(truckIcon);
          marker.setPopupContent(popupContent);
        } else {
          const newMarker = L.marker([vehicle.currentPosition.lat, vehicle.currentPosition.lng], { icon: truckIcon })
            .addTo(map)
            .bindPopup(popupContent);
          vehicleMarkersRef.current.set(vehicle.id, newMarker);
        }
      } else {
        // If vehicle is not in transit, remove it from the map
        if (marker) {
            marker.remove();
            vehicleMarkersRef.current.delete(vehicle.id);
        }
      }
    });

  }, [vehicles]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
}

    