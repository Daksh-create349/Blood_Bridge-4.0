'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useApp } from '@/context/app-provider';
import type { Hospital, Vehicle } from '@/lib/types';

// Fix for default icon path issue
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
    shadowSize: [41, 41],
  });
  L.Marker.prototype.options.icon = defaultIcon;
}

const vehicleIcon = (color: string) => {
  return L.divIcon({
    html: `
      <div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; display: flex; justify-content: center; align-items: center; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);">
        🚚
      </div>
    `,
    className: 'vehicle-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export function LogisticsMap() {
  const { hospitals, vehicles } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const vehicleMarkersRef = useRef<Map<string, L.Marker>>(new Map());

  // Initialize map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [19.076, 72.8777],
        zoom: 10,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Add hospital markers
  useEffect(() => {
    if (mapRef.current) {
      hospitals.forEach((hospital: Hospital) => {
        L.marker([hospital.lat, hospital.lng])
          .addTo(mapRef.current!)
          .bindPopup(`<b>${hospital.name}</b><br>${hospital.location}`);
      });
    }
  }, [hospitals, mapRef]);

  // Update vehicle markers
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const markers = vehicleMarkersRef.current;

    vehicles.forEach((vehicle: Vehicle) => {
      let marker = markers.get(vehicle.id);
      
      if (vehicle.status === 'In Transit') {
        if (!marker) {
          // Add new marker
          marker = L.marker(vehicle.currentPosition, { icon: vehicleIcon(vehicle.routeColor) }).addTo(map);
          marker.bindPopup(`<b>Vehicle ${vehicle.id}</b><br>To: ${vehicle.to.name}<br>Status: In Transit`);
          markers.set(vehicle.id, marker);
        } else {
          // Update existing marker
          marker.setLatLng(vehicle.currentPosition);
        }
      } else if (vehicle.status === 'Delivered') {
        if (marker) {
          // Remove delivered marker from map and from ref
          map.removeLayer(marker);
          markers.delete(vehicle.id);
        }
      }
    });

  }, [vehicles]);


  return <div ref={mapContainerRef} className="h-full w-full z-0" />;
}
