import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#9CA3AF',
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          backgroundColor: '#FFFFFF',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rotina"
        options={{
          title: 'Rotina',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="checklist" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="estudos"
        options={{
          title: 'Estudos',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="book.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="financeiro"
        options={{
          title: 'Finanças',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="dollarsign" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="fiverr"
        options={{
          title: 'Fiverr',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="briefcase.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="secretaria"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="planejamento"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
