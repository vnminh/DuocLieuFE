'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/features/common-ui/Sidebar';
import { cookieStorage } from '@/lib/cookieStorage';
import { LogOut, PanelLeft } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleSignOut = () => {
    cookieStorage.logout();
    window.location.reload();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isExpanded={isExpanded} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={toggleSidebar}
                  className="p-2 mr-3 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  title="Toggle sidebar"
                >
                  <PanelLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold text-gray-900">
                  Dashboard
                </h2>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleSignOut}
                  className="p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-gray-100 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}