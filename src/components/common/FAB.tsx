import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export function FAB() {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.fab}
      activeOpacity={0.8}
      onPress={() => router.push('/(app)/secretaria/chat')}
    >
      <Text style={styles.icon}>💬</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: Platform.OS === 'ios' ? 100 : 85,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  icon: {
    fontSize: 28,
  },
});
