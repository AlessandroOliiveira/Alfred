import React, { ReactNode } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
}

export function Card({ children, onPress, className, variant = 'elevated' }: CardProps) {
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={variant === 'elevated' ? styles.elevated : undefined}
      className={clsx(
        'rounded-xl p-4',
        variant === 'elevated' && 'bg-surface',
        variant === 'default' && 'bg-surface border border-border',
        variant === 'outlined' && 'bg-transparent border-2 border-border',
        variant === 'flat' && 'bg-gray-50',
        className
      )}
    >
      {children}
    </Component>
  );
}

const styles = StyleSheet.create({
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
});
