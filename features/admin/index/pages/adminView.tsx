'use client';

import React from 'react';
import Link from 'next/link';
import { adminRoutes } from '@/lib/routes';

export default function AdminView(){
    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">Admin Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {adminRoutes.map((route) => {
                    const Icon = route.icon;
                    return (
                        <Link key={route.href} href={route.href} className="block">
                            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-800 dark:text-gray-100">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-lg font-medium text-gray-900 dark:text-gray-100">{route.name}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{route.description || `Manage ${route.name.toLowerCase()}`}</div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    )
}