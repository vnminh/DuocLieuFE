import React from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, type, value, children, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className='flex flex-row items-center rounded-md border border-gray-300 bg-white focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-700 focus-within:border-transparent'>
        {children}
        <input
          className={cn(
            'flex h-10 w-full px-3 py-2 text-sm placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 outline-none',
            error && 'border-red-500 focus:ring-red-500',
            className,
            !value && type==='date'?'text-gray-400':'text-gray-700'
          )}
          value={value}
          type={type}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}