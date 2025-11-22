import {
  LayoutDashboard,
  Send,
  Bell,
  History,
  Tent,
  AreaChart,
  Users,
  Settings,
  Truck,
  BrainCircuit,
  Info,
} from 'lucide-react';

export const navLinks = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/send-request',
    label: 'Send Request',
    icon: Send,
  },
  {
    href: '/view-alerts',
    label: 'Active Requests',
    icon: Bell,
  },
  {
    href: '/request-history',
    label: 'Request History',
    icon: History,
  },
  {
    href: '/camps',
    label: 'Donation Camps',
    icon: Tent,
  },
  {
    href: '/analytics',
    label: 'Analytics',
    icon: AreaChart,
  },
  {
    href: '/donors',
    label: 'Donors',
    icon: Users,
  },
  {
    href: '/logistics',
    label: 'Smart Logistics',
    icon: Truck,
  },
  {
    href: '/ai-supply-forecasting',
    label: 'AI Supply Forecasting',
    icon: BrainCircuit,
  },
  {
    href: '/about',
    label: 'About Us',
    icon: Info,
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: Settings,
  },
];
