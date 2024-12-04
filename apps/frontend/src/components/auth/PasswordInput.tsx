import { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface PasswordInputProps {
  id: string;
  label: string;
  register: UseFormRegisterReturn;
  error?: string;
  placeholder?: string;
}

export function PasswordInput({
  id,
  label,
  register,
  error,
  placeholder,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-0.5">
      <Label htmlFor={id} className="text-xs text-gray-700 dark:text-gray-300">
        {label}
      </Label>
      <div className="relative">
        <Input
          {...register}
          type={showPassword ? 'text' : 'password'}
          id={id}
          placeholder={placeholder}
          className="h-9 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
        />
        <button
          type="button"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <Eye className="h-4 w-4" aria-hidden="true" />
          ) : (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="text-red-500 text-xs">
          {error}
        </p>
      )}
    </div>
  );
}
