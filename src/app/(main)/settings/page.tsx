'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ThemeToggle from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function SettingsPage() {

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Settings"
        description="Customize your experience with the Blood Bridge app."
      />

      <div className="mt-8 max-w-lg grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Choose how you want the application to look.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeToggle />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Navigation</CardTitle>
            <CardDescription>
              Navigate back to the main welcome page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return to Welcome Page
                </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
