
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import Icon from './Icon';
import { colors, commonStyles } from '../styles/commonStyles';
import SimpleBottomSheet from './BottomSheet';

const tabs = [
  { name: 'dashboard', icon: 'home-outline', activeIcon: 'home', route: '/', label: 'Dashboard' },
  { name: 'agenda', icon: 'calendar-outline', activeIcon: 'calendar', route: '/agenda', label: 'Agenda' },
  { name: 'chat', icon: 'chatbubble-outline', activeIcon: 'chatbubble', route: '/chat', label: 'Chat', isCenter: true },
  { name: 'finances', icon: 'card-outline', activeIcon: 'card', route: '/finances', label: 'Finanças' },
  { name: 'tasks', icon: 'apps-outline', activeIcon: 'apps', route: '/tasks', label: 'Mais', isSpecial: true },
];

const taskOptions = [
  { name: 'tasks', icon: 'checkbox-outline', route: '/tasks', label: 'Tarefas', color: colors.primary },
  { name: 'goals', icon: 'trophy-outline', route: '/goals', label: 'Metas', color: colors.success },
  { name: 'notes', icon: 'document-text-outline', route: '/notes', label: 'Notas', color: colors.warning },
];

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [showTaskOptions, setShowTaskOptions] = useState(false);

  const handleTabPress = (tab: any) => {
    console.log('Tab pressed:', tab.name);
    
    if (tab.isSpecial) {
      setShowTaskOptions(true);
    } else {
      router.push(tab.route as any);
    }
  };

  const handleTaskOptionPress = (option: any) => {
    console.log('Task option pressed:', option.name);
    setShowTaskOptions(false);
    router.push(option.route as any);
  };

  const isTaskRoute = ['/tasks', '/goals', '/notes'].includes(pathname);

  return (
    <>
      <View style={[styles.container, commonStyles.bottomTabBar]}>
        {tabs.map((tab) => {
          const isActive = tab.isSpecial ? isTaskRoute : pathname === tab.route;
          return (
            <TouchableOpacity
              key={tab.name}
              style={[
                styles.tab,
                tab.isCenter && styles.centerTab,
              ]}
              onPress={() => handleTabPress(tab)}
            >
              {tab.isCenter ? (
                <View style={styles.centerTabContent}>
                  <Icon
                    name={isActive ? tab.activeIcon as any : tab.icon as any}
                    size={28}
                    color={isActive ? colors.background : colors.background}
                  />
                </View>
              ) : (
                <Icon
                  name={isActive ? tab.activeIcon as any : tab.icon as any}
                  size={24}
                  color={isActive ? colors.primary : colors.text}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <SimpleBottomSheet
        isVisible={showTaskOptions}
        onClose={() => setShowTaskOptions(false)}
      >
        <View style={styles.taskOptionsContent}>
          <Text style={[commonStyles.subtitle, { marginBottom: 24, textAlign: 'center' }]}>
            Escolha uma opção
          </Text>
          
          <View style={styles.taskOptionsGrid}>
            {taskOptions.map((option) => (
              <TouchableOpacity
                key={option.name}
                style={styles.taskOption}
                onPress={() => handleTaskOptionPress(option)}
              >
                <View style={[styles.taskOptionIcon, { backgroundColor: option.color + '20' }]}>
                  <Icon name={option.icon as any} size={32} color={option.color} />
                </View>
                <Text style={[commonStyles.text, { marginTop: 12, fontWeight: '600' }]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SimpleBottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  centerTab: {
    marginHorizontal: 8,
  },
  centerTabContent: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  taskOptionsContent: {
    paddingVertical: 20,
  },
  taskOptionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  taskOption: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    backgroundColor: colors.backgroundAlt,
    minWidth: 100,
  },
  taskOptionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
