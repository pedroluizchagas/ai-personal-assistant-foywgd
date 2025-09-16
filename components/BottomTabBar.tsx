
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import Icon from './Icon';
import { colors, commonStyles } from '../styles/commonStyles';

const tabs = [
  { name: 'dashboard', icon: 'home-outline', activeIcon: 'home', route: '/' },
  { name: 'chat', icon: 'chatbubble-outline', activeIcon: 'chatbubble', route: '/chat' },
  { name: 'finances', icon: 'card-outline', activeIcon: 'card', route: '/finances' },
  { name: 'tasks', icon: 'checkbox-outline', activeIcon: 'checkbox', route: '/tasks' },
  { name: 'notes', icon: 'document-text-outline', activeIcon: 'document-text', route: '/notes' },
];

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={[styles.container, commonStyles.bottomTabBar]}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.route;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => router.push(tab.route as any)}
          >
            <Icon
              name={isActive ? tab.activeIcon as any : tab.icon as any}
              size={24}
              color={isActive ? colors.primary : colors.text}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
});
