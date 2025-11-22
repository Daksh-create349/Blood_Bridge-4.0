'use client';

import { useEffect, useRef, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
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

const routeColors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6'];
const MAX_EVENTS = 50;

export function LogisticsMap() {
  const { hospitals, vehicles, setVehicles, setLogisticsEvents, logisticsEvents } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const vehicleMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const dispatchIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const dispatchNewVehicle = useCallback(() => {
    setVehicles(currentVehicles => {
        if (currentVehicles.filter(v => v.status === 'In Transit').length >= 8) {
          return currentVehicles;
        }

        const availableHospitals = [...hospitals];
        if (availableHospitals.length < 2) return currentVehicles;

        const fromIndex = Math.floor(Math.random() * availableHospitals.length);
        const from = availableHospitals.splice(fromIndex, 1)[0];
        const toIndex = Math.floor(Math.random() * availableHospitals.length);
        const to = availableHospitals[toIndex];
        
        const id = `v${Date.now()}`;
        const departureTime = Date.now();
        const eta = (Math.floor(Math.random() * 2) + 1) * 60 * 1000; // 1-3 minutes

        const newVehicle: Vehicle = {
            id, from, to, status: 'In Transit', departureTime, eta,
            currentPosition: [from.lat, from.lng],
            routeColor: routeColors[Math.floor(Math.random() * routeColors.length)],
        };
        
        setLogisticsEvents(prev => [{ id: `evt-dispatch-${id}-${Math.random()}`, message: `Vehicle ${id} dispatched from ${from.name} to ${to.name}.`, timestamp: new Date().toISOString() }, ...prev].slice(0, MAX_EVENTS));
        return [...currentVehicles, newVehicle];
    });
  }, [hospitals, setVehicles, setLogisticsEvents]);

  // Map Initialization
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current && hospitals.length > 0) {
      // Calculate map center
      const latitudes = hospitals.map(h => h.lat);
      const longitudes = hospitals.map(h => h.lng);
      const centerLat = latitudes.reduce((sum, lat) => sum + lat, 0) / latitudes.length;
      const centerLng = longitudes.reduce((sum, lng) => sum + lng, 0) / longitudes.length;

      mapRef.current = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 7, // Adjust zoom level to see all cities
        scrollWheelZoom: true,
      });

      const standardLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      const satelliteLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution:
            'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        }
      );

      const baseMaps = {
        'Standard View': standardLayer,
        'Satellite View': satelliteLayer,
      };

      L.control.layers(baseMaps).addTo(mapRef.current);

      hospitals.forEach((hospital: Hospital) => {
        L.marker([hospital.lat, hospital.lng])
          .addTo(mapRef.current!)
          .bindPopup(`<b>${hospital.name}</b><br>${hospital.location}`);
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [hospitals]);

  // Simulation Logic
  useEffect(() => {
    if (logisticsEvents.length >= MAX_EVENTS) {
        if (dispatchIntervalRef.current) {
            clearInterval(dispatchIntervalRef.current);
            dispatchIntervalRef.current = null;
        }
        return;
    }

    if (!dispatchIntervalRef.current) {
        dispatchIntervalRef.current = setInterval(dispatchNewVehicle, 5000); // Dispatch new vehicle every 5s
    }

    const updateInterval = setInterval(() => {
        setVehicles(currentVehicles => currentVehicles.map(v => {
            if (v.status !== 'In Transit') return v;

            const now = Date.now();
            const elapsedTime = now - v.departureTime;

            if (elapsedTime >= v.eta) {
                setLogisticsEvents(prev => {
                    if (prev.length >= MAX_EVENTS) return prev;
                    return [{ id: `evt-delivered-${v.id}-${Math.random()}`, message: `Vehicle ${v.id} delivered to ${v.to.name}.`, timestamp: new Date().toISOString() }, ...prev].slice(0, MAX_EVENTS)
                });
                return { ...v, status: 'Delivered', currentPosition: [v.to.lat, v.to.lng] };
            }

            const progress = elapsedTime / v.eta;
            const newLat = v.from.lat + (v.to.lat - v.from.lat) * progress;
            const newLng = v.from.lng + (v.to.lng - v.from.lng) * progress;

            return { ...v, currentPosition: [newLat, newLng] };
        }).filter(v => v.status !== 'Delivered' || (Date.now() - (v.departureTime + v.eta)) < 5000)
      );
    }, 1000);

    return () => {
        if (dispatchIntervalRef.current) {
            clearInterval(dispatchIntervalRef.current);
            dispatchIntervalRef.current = null;
        }
        clearInterval(updateInterval);
    };
  }, [dispatchNewVehicle, setVehicles, setLogisticsEvents, logisticsEvents.length]);


  // Update map markers
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const markers = vehicleMarkersRef.current;
    const newMarkers = new Map<string, L.Marker>();

    vehicles.forEach((vehicle) => {
      let marker = markers.get(vehicle.id);
      if (marker) {
        marker.setLatLng(vehicle.currentPosition);
        newMarkers.set(vehicle.id, marker);
        markers.delete(vehicle.id);
      } else {
        const newMarker = L.marker(vehicle.currentPosition, { icon: vehicleIcon(vehicle.routeColor) }).addTo(map);
        newMarker.bindPopup(`<b>Vehicle ${vehicle.id}</b><br>To: ${vehicle.to.name}<br>Status: In Transit`);
        newMarkers.set(vehicle.id, newMarker);
      }
    });

    markers.forEach(marker => map.removeLayer(marker));
    vehicleMarkersRef.current = newMarkers;

  }, [vehicles]);

  return <div ref={mapContainerRef} className="h-full w-full z-0" />;
}
