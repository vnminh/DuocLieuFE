'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cookieStorage } from '@/lib/cookieStorage';
import { UserRole } from '@/types/user';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in via cookie
    const user = cookieStorage.getUser();

    if (user) {
      // Redirect based on role
      if (user.role === UserRole.USER) {
        router.replace('/admin/search');
      } else {
        router.replace('/admin/users');
      }
    } else {
      // User is not logged in, redirect to login page
      router.replace('/account/login');
    }
  }, [router]);

  // Show loading while checking auth state
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
