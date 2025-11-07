import clsx from 'clsx';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className,
}: ButtonProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'py-2 px-3';
      case 'lg':
        return 'py-4 px-6';
      default:
        return 'py-3 px-5';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={variant !== 'ghost' && variant !== 'outline' ? styles.shadow : undefined}
      className={clsx(
        'rounded-xl items-center justify-center',
        getSizeClasses(),
        variant === 'primary' && 'bg-primary',
        variant === 'secondary' && 'bg-secondary',
        variant === 'outline' && 'border-2 border-primary bg-transparent',
        variant === 'danger' && 'bg-danger',
        variant === 'ghost' && 'bg-transparent',
        (disabled || loading) && 'opacity-50',
        className
      )}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? '#6366F1' : '#fff'}
          size="small"
        />
      ) : (
        <Text
          className={clsx(
            'text-center font-semibold',
            getTextSize(),
            variant === 'outline' && 'text-primary',
            variant === 'ghost' && 'text-primary',
            (variant === 'primary' || variant === 'secondary' || variant === 'danger') && 'text-white'
          )}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
