'use client';

import { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { DonationCamp } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { renderToStaticMarkup } from 'react-dom/server';

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

interface CampsMapProps {
  camps: DonationCamp[];
  onRegisterClick: (camp: DonationCamp) => void;
}

export function CampsMap({ camps, onRegisterClick }: CampsMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Prevent re-initialization
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    mapRef.current = L.map(mapContainerRef.current, {
      center: [19.0760, 72.8777], // Default center
      zoom: 10,
      scrollWheelZoom: false,
    });

    // Add layers control
    const standardLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }
    ).addTo(mapRef.current);

    const satelliteLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community' }
    );

    const baseMaps = {
      "Standard View": standardLayer,
      "Satellite View": satelliteLayer
    };

    L.control.layers(baseMaps).addTo(mapRef.current);
    
    // Add user location marker
    mapRef.current.locate().on('locationfound', function (e) {
        L.marker(e.latlng).addTo(mapRef.current!).bindPopup('You are here').openPopup();
        mapRef.current!.flyTo(e.latlng, 13);
    });

    // Add camp markers
    camps.forEach((camp) => {
      const marker = L.marker([camp.lat, camp.lng]).addTo(mapRef.current!);
      
      const popupContent = document.createElement('div');
      popupContent.innerHTML = renderToStaticMarkup(
          <div className="p-1 w-60">
              <h3 className="font-bold font-headline">{camp.name}</h3>
              <p className="text-sm text-muted-foreground">{camp.location}</p>
              <p className="text-sm mt-1">{format(new Date(camp.date), 'EEE, dd MMM yyyy')}</p>
          </div>
      );
      
      const registerButton = document.createElement('div');
      registerButton.innerHTML = renderToStaticMarkup(<Button size="sm" className="mt-2 w-full">Register</Button>)
      registerButton.onclick = () => onRegisterClick(camp);

      popupContent.appendChild(registerButton);
      
      marker.bindPopup(popupContent);
    });

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once

  return <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />;
}
