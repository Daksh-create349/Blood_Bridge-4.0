'use client';

import { useEffect, useRef, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useApp } from '@/context/app-provider';
import { Hospital } from '@/lib/types';

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


const routeColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFA1'];
const getRandomColor = () => routeColors[Math.floor(Math.random() * routeColors.length)];

export function LogisticsMap() {
  const { hospitals } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const polylinesRef = useRef<L.Polyline[]>([]);

  const routes = useMemo(() => {
    if (hospitals.length < 4) return [];
    // Create some predefined routes for visualization
    const potentialRoutes = [
      { from: hospitals[0], to: hospitals[1] },
      { from: hospitals[2], to: hospitals[3] },
      { from: hospitals[4], to: hospitals[8] },
      { from: hospitals[9], to: hospitals[12] },
      { from: hospitals[13], to: hospitals[15] },
      { from: hospitals[5], to: hospitals[6] },
    ];
    return potentialRoutes.filter(route => route.from && route.to);
  }, [hospitals]);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
        const center: [number, number] =
        hospitals.length > 0 ? [19.076, 72.8777] : [51.505, -0.09];

        mapRef.current = L.map(mapContainerRef.current, {
        center: center,
        zoom: 10,
        scrollWheelZoom: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapRef.current);

        hospitals.forEach((hospital: Hospital) => {
        L.marker([hospital.lat, hospital.lng])
            .addTo(mapRef.current!)
            .bindPopup(`
            <div class="font-semibold flex items-center gap-2">
                <span style="color:hsl(var(--primary));">🏥</span> ${hospital.name}
            </div>
            <p class="text-muted-foreground">${hospital.location}</p>
            `);
        });

        polylinesRef.current = routes.map(route => {
        return L.polyline(
            [
            [route.from.lat, route.from.lng],
            [route.to.lat, route.to.lng],
            ],
            { color: getRandomColor(), weight: 5, opacity: 0.7 }
        ).addTo(mapRef.current!);
        });
    }

    const interval = setInterval(() => {
      polylinesRef.current.forEach(line => {
        line.setStyle({ color: getRandomColor() });
      });
    }, 10000);

    return () => {
      clearInterval(interval);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [hospitals, routes]);

  return <div ref={mapContainerRef} className="h-full w-full z-0" />;
}
