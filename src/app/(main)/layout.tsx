import { Header } from '@/components/layout/header';
import { AppSidebar } from '@/components/layout/app-sidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="flex h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto overflow-x-hidden h-full">
            <div className="container mx-auto py-8 h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
  );
}
