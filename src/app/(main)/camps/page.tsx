'use client';

import { useState } from 'react';
import { useApp } from '@/context/app-provider';
import { PageHeader } from '@/components/page-header';
import { CampsMap } from './components/camps-map';
import { CampCard } from './components/camp-card';
import { RegistrationDialog } from './components/registration-dialog';
import { DonationCamp } from '@/lib/types';
import { APIProvider } from '@vis.gl/react-google-maps';

// Add a comment to guide the user to add their Google Maps API key
// To enable map functionality, create a .env.local file in the root directory
// and add your Google Maps API key like this:
// NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YourApiKeyHere

export default function DonationCampsPage() {
  const { camps } = useApp();
  const [selectedCamp, setSelectedCamp] = useState<DonationCamp | null>(null);

  const handleRegister = (camp: DonationCamp) => {
    setSelectedCamp(camp);
  };

  const handleCloseDialog = () => {
    setSelectedCamp(null);
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <div className="container mx-auto py-8">
        <PageHeader
          title="Donation Camps"
          description="Find and register for upcoming blood donation camps near you."
        />

        <div className="mt-8">
          <div className="h-[400px] w-full rounded-lg overflow-hidden border">
            <CampsMap camps={camps} onRegisterClick={handleRegister} />
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {camps.map((camp) => (
            <CampCard key={camp.id} camp={camp} onRegister={handleRegister} />
          ))}
        </div>

        {selectedCamp && (
          <RegistrationDialog
            camp={selectedCamp}
            isOpen={!!selectedCamp}
            onOpenChange={handleCloseDialog}
          />
        )}
      </div>
    </APIProvider>
  );
}
