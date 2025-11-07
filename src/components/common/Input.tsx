import React from 'react';
import { TextInput, View, Text } from 'react-native';
import clsx from 'clsx';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
  className?: string;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  secureTextEntry,
  keyboardType = 'default',
  multiline = false,
  numberOfLines,
  className,
}: InputProps) {
  return (
    <View className={clsx('mb-4', className)}>
      {label && (
        <Text className="text-text-primary font-semibold mb-2">{label}</Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        className={clsx(
          'border border-border rounded-lg px-4 py-3 text-text-primary',
          error && 'border-danger',
          multiline && 'min-h-[100px]'
        )}
        placeholderTextColor="#6B7280"
      />
      {error && <Text className="text-danger text-sm mt-1">{error}</Text>}
    </View>
  );
}
