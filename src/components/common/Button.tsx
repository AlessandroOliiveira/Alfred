import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import clsx from 'clsx';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  className,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={clsx(
        'py-3 px-4 rounded-lg items-center justify-center',
        variant === 'primary' && 'bg-primary',
        variant === 'secondary' && 'bg-secondary',
        variant === 'outline' && 'border-2 border-primary bg-transparent',
        variant === 'danger' && 'bg-danger',
        (disabled || loading) && 'opacity-50',
        className
      )}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? '#6366F1' : '#fff'}
        />
      ) : (
        <Text
          className={clsx(
            'text-center font-bold text-base',
            variant === 'outline' ? 'text-primary' : 'text-white'
          )}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
