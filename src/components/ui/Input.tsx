'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className = '', type, ...props }, ref) => {
    return (
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-text">{label}</label>
        {type === 'checkbox' ? (
          <input
            ref={ref}
            type="checkbox"
            className={`h-4 w-4 rounded border-gray-300 focus:ring-secondary ${className}`}
            {...props}
          />
        ) : (
          <input
            ref={ref}
            type={type}
            className={`w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-secondary ${className}`}
            {...props}
          />
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;