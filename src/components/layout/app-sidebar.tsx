'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeartPulse, PanelLeft } from 'lucide-react';

import { navLinks } from '@/lib/nav-links';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import { useTheme } from 'next-themes';
import ThemeToggle from '../theme-toggle';

export function AppSidebar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const { state, toggleSidebar } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader className="border-b justify-between">
        <div className={cn("flex items-center gap-2 p-2", state === 'collapsed' && 'p-0')}>
            <Button variant="ghost" size="icon" className="shrink-0" asChild>
                <Link href="/">
                    <HeartPulse className="h-6 w-6 text-primary" />
                </Link>
            </Button>
            <div className={cn("flex min-w-0 flex-1 flex-col overflow-hidden transition-opacity duration-300", state === 'collapsed' && 'opacity-0 w-0')}>
                <p className="truncate font-headline text-lg font-semibold">Blood Bridge</p>
            </div>
        </div>
         <Button
            size="icon"
            variant="ghost"
            className="hidden md:flex"
            onClick={toggleSidebar}
        >
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navLinks.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(link.href)}
                tooltip={{ children: link.label }}
              >
                <Link href={link.href}>
                  <link.icon />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
