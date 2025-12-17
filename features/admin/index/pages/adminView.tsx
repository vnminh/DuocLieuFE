'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Filter, Heart, Layers, Settings } from 'lucide-react';

export default function AdminView(){
    const cards = [
        { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-6 h-6" /> },
        { name: 'Users', href: '/admin/users', icon: <Users className="w-6 h-6" /> },
        { name: 'Nganhs', href: '/admin/nganhs', icon: <Filter className="w-6 h-6" /> },
        { name: 'Hos', href: '/admin/hos', icon: <Heart className="w-6 h-6" /> },
        { name: 'Loais', href: '/admin/loais', icon: <Layers className="w-6 h-6" /> },
        { name: 'Settings', href: '/admin/settings', icon: <Settings className="w-6 h-6" /> },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">Admin Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {cards.map((card) => (
                    <Link key={card.name} href={card.href} className="block">
                        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4">
                              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-800 dark:text-gray-100">
                                {card.icon}
                            </div>
                            <div>
                                <div className="text-lg font-medium text-gray-900 dark:text-gray-100">{card.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Manage {card.name.toLowerCase()}</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}