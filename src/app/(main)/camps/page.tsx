'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useApp } from '@/context/app-provider';
import { PageHeader } from '@/components/page-header';
import { CampCard } from './components/camp-card';
import { RegistrationDialog } from './components/registration-dialog';
import { DonationCamp } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamically import the map component to ensure it only runs on the client-side
const CampsMap = dynamic(() => import('./components/camps-map-leaflet').then(mod => mod.CampsMap), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

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
  );
}
