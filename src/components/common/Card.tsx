import React, { ReactNode } from 'react';
import { View, TouchableOpacity } from 'react-native';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  className?: string;
}

export function Card({ children, onPress, className }: CardProps) {
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      onPress={onPress}
      className={clsx(
        'bg-white rounded-lg p-4 shadow-sm border border-border',
        className
      )}
    >
      {children}
    </Component>
  );
}
