import { Calendar, LayoutDashboard, Settings, WalletCards, List } from "lucide-react";

export const SideBarOptions = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard, // ← Add missing icon
    path: '/dashboard',
  },
  {
    name: 'Scheduled Interview',
    icon: Calendar,
    path: '/scheduled-interview',
  },
  {
    name: 'All Interview',
    icon: List,
    path: '/all-interview',
  },
  {
    name: 'Billing',
    icon: WalletCards,
    path: '/billing',
  },
  {
    name: 'Settings',
    icon: Settings,
    path: '/settings',
  },
];
