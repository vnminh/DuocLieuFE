'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getRoutesForRole } from '@/lib/routes';
import { cookieStorage } from '@/lib/cookieStorage';
import { UserRole } from '@/types/user';

interface SidebarProps {
  className?: string;
  isExpanded?: boolean;
}

export function Sidebar({ className, isExpanded = true }: SidebarProps) {
  const pathname = usePathname();
  const user = cookieStorage.getUser();
  const role = user?.role || UserRole.USER;

  const routes = useMemo(() => getRoutesForRole(role), [role]);

  return (
    <div
      className={cn(
        'flex flex-col bg-gray-900 transition-all duration-300 ease-in-out',
        isExpanded ? 'w-64' : 'w-16',
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 bg-gray-800">
        {isExpanded ? (
          <h1 className="text-xl font-bold text-white whitespace-nowrap overflow-hidden">
            Duoc Lieu
          </h1>
        ) : (
          <div className="w-full flex justify-center">
            <span className="text-xl font-bold text-white">DL</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {routes.map((route) => {
          const Icon = route.icon;
          const isActive =
            pathname === route.href ||
            (route.href !== '/admin' && pathname.startsWith(route.href));

          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'group flex items-center py-2 text-sm font-medium rounded-md transition-colors',
                isExpanded ? 'px-2' : 'px-0 justify-center',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              )}
              title={!isExpanded ? route.name : undefined}
            >
              <span className={cn('flex-shrink-0', isExpanded && 'mr-3')}>
                <Icon className="w-5 h-5" />
              </span>
              {isExpanded && (
                <span className="whitespace-nowrap overflow-hidden">
                  {route.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-gray-700">
        <div
          className={cn(
            'flex items-center',
            !isExpanded && 'justify-center'
          )}
        >
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-white">
                {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          {isExpanded && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-white whitespace-nowrap">
                {user?.full_name || 'Người dùng'}
              </p>
              <p className="text-xs text-gray-400 whitespace-nowrap">
                {role}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}