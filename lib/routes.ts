import {
  LayoutDashboard,
  Users,
  Filter,
  Heart,
  Layers,
  Settings,
  MapPin,
  Map,
  LucideIcon,
} from 'lucide-react';

export interface AdminRoute {
  name: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

export const adminRoutes: AdminRoute[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    description: 'Overview and statistics',
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
    description: 'Manage users',
  },
  {
    name: 'Nganhs',
    href: '/admin/nganhs',
    icon: Filter,
    description: 'Manage nganhs',
  },
  {
    name: 'Hos',
    href: '/admin/hos',
    icon: Heart,
    description: 'Manage hos',
  },
  {
    name: 'Loais',
    href: '/admin/loais',
    icon: Layers,
    description: 'Manage loais',
  },
  {
    name: 'Vùng Phân Bố',
    href: '/admin/vung-phan-bo',
    icon: MapPin,
    description: 'Manage vùng phân bố',
  },
  {
    name: 'Loai Map',
    href: '/admin/loai-map',
    icon: Map,
    description: 'Manage loai map',
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'System settings',
  },
];
