
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import BottomTabBar from '../components/BottomTabBar';
import DashboardCard from '../components/DashboardCard';
import ProgressRing from '../components/ProgressRing';
import Icon from '../components/Icon';
import SimpleBottomSheet from '../components/BottomSheet';
import { mockTasks, mockGoals, mockExpenses, mockAppointments } from '../data/mockData';

export default function Dashboard() {
  const router = useRouter();
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  // Calculate dashboard metrics
  const pendingTasks = mockTasks.filter(task => !task.completed).length;
  const completedGoals = mockGoals.filter(goal => goal.completed).length;
  const totalIncome = mockExpenses
    .filter(expense => expense.type === 'income')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const totalExpenses = mockExpenses
    .filter(expense => expense.type === 'expense')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const balance = totalIncome - totalExpenses;

  const nextAppointment = mockAppointments
    .filter(apt => apt.date > new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())[0];

  const goalProgress = mockGoals.length > 0 
    ? mockGoals.reduce((sum, goal) => sum + (goal.currentValue / goal.targetValue), 0) / mockGoals.length 
    : 0;

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => {
              console.log('Profile button pressed - navigating to profile');
              router.push('/profile');
            }}
          >
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={[commonStyles.title, { fontSize: 24, marginBottom: 4 }]}>Dashboard</Text>
            <Text style={commonStyles.textSecondary}>
              Bem-vindo de volta! 👋
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => {
            console.log('Settings button pressed - opening bottom sheet');
            setIsSettingsVisible(true);
          }}
        >
          <Icon name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <DashboardCard
            title="Tarefas Pendentes"
            value={pendingTasks}
            icon="checkbox-outline"
            color={colors.warning}
            onPress={() => router.push('/tasks')}
          />
          <DashboardCard
            title="Saldo Atual"
            value={`R$ ${balance.toFixed(2)}`}
            icon="card-outline"
            color={balance >= 0 ? colors.success : colors.error}
            onPress={() => router.push('/finances')}
          />
        </View>

        {/* Goals Progress */}
        <View style={commonStyles.card}>
          <View style={commonStyles.spaceBetween}>
            <Text style={commonStyles.subtitle}>Progresso das Metas</Text>
            <TouchableOpacity onPress={() => router.push('/goals')}>
              <Text style={[commonStyles.textSecondary, { color: colors.primary }]}>
                Ver todas
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.progressContainer}>
            <ProgressRing progress={goalProgress} color={colors.primary}>
              <Text style={[commonStyles.text, { fontWeight: '700' }]}>
                {Math.round(goalProgress * 100)}%
              </Text>
            </ProgressRing>
            <View style={styles.progressInfo}>
              <Text style={commonStyles.text}>
                {mockGoals.length} metas ativas
              </Text>
              <Text style={commonStyles.textSecondary}>
                {completedGoals} concluídas este mês
              </Text>
            </View>
          </View>
        </View>

        {/* Next Appointment */}
        {nextAppointment && (
          <View style={commonStyles.card}>
            <Text style={commonStyles.subtitle}>Próximo Compromisso</Text>
            <View style={styles.appointmentCard}>
              <View style={styles.appointmentIcon}>
                <Icon name="calendar" size={20} color={colors.primary} />
              </View>
              <View style={styles.appointmentInfo}>
                <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                  {nextAppointment.title}
                </Text>
                <Text style={commonStyles.textSecondary}>
                  {nextAppointment.date.toLocaleDateString('pt-BR')} às{' '}
                  {nextAppointment.date.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
                {nextAppointment.location && (
                  <Text style={commonStyles.textSecondary}>
                    📍 {nextAppointment.location}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Recent Tasks */}
        <View style={commonStyles.card}>
          <View style={commonStyles.spaceBetween}>
            <Text style={commonStyles.subtitle}>Tarefas Recentes</Text>
            <TouchableOpacity onPress={() => router.push('/tasks')}>
              <Text style={[commonStyles.textSecondary, { color: colors.primary }]}>
                Ver todas
              </Text>
            </TouchableOpacity>
          </View>
          
          {mockTasks.slice(0, 3).map((task) => (
            <View key={task.id} style={styles.taskItem}>
              <View style={styles.taskIcon}>
                <Icon 
                  name={task.completed ? "checkmark-circle" : "ellipse-outline"} 
                  size={20} 
                  color={task.completed ? colors.success : colors.textSecondary} 
                />
              </View>
              <View style={styles.taskInfo}>
                <Text style={[
                  commonStyles.text,
                  task.completed && styles.completedTask
                ]}>
                  {task.title}
                </Text>
                {task.dueDate && (
                  <Text style={commonStyles.textSecondary}>
                    Vence em {task.dueDate.toLocaleDateString('pt-BR')}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Ações Rápidas</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => router.push('/chat')}
            >
              <Icon name="chatbubble" size={24} color={colors.primary} />
              <Text style={styles.quickActionText}>Chat IA</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => router.push('/tasks')}
            >
              <Icon name="add-circle" size={24} color={colors.success} />
              <Text style={styles.quickActionText}>Nova Tarefa</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => router.push('/finances')}
            >
              <Icon name="card" size={24} color={colors.warning} />
              <Text style={styles.quickActionText}>Registrar Gasto</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => router.push('/notes')}
            >
              <Icon name="document-text" size={24} color={colors.secondary} />
              <Text style={styles.quickActionText}>Nova Nota</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomTabBar />

      <SimpleBottomSheet
        isVisible={isSettingsVisible}
        onClose={() => setIsSettingsVisible(false)}
      >
        <View style={styles.settingsContent}>
          <Text style={[commonStyles.subtitle, { marginBottom: 24 }]}>Configurações</Text>
          
          <View style={styles.settingsSection}>
            <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 16 }]}>
              Preferências do Sistema
            </Text>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => console.log('Dark theme toggle pressed')}
            >
              <View style={styles.settingLeft}>
                <Icon name="moon-outline" size={20} color={colors.text} />
                <Text style={[commonStyles.text, { marginLeft: 12 }]}>Tema Escuro</Text>
              </View>
              <Icon name="toggle-outline" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => console.log('Language setting pressed')}
            >
              <View style={styles.settingLeft}>
                <Icon name="language-outline" size={20} color={colors.text} />
                <Text style={[commonStyles.text, { marginLeft: 12 }]}>Idioma</Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={commonStyles.textSecondary}>Português</Text>
                <Icon name="chevron-forward" size={16} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Icon name="notifications-outline" size={20} color={colors.text} />
                <Text style={[commonStyles.text, { marginLeft: 12 }]}>Notificações</Text>
              </View>
              <Icon name="chevron-forward" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.settingsSection}>
            <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 16 }]}>
              Configurações do App
            </Text>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Icon name="sync-outline" size={20} color={colors.text} />
                <Text style={[commonStyles.text, { marginLeft: 12 }]}>Sincronização</Text>
              </View>
              <Icon name="toggle-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Icon name="shield-outline" size={20} color={colors.text} />
                <Text style={[commonStyles.text, { marginLeft: 12 }]}>Privacidade</Text>
              </View>
              <Icon name="chevron-forward" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Icon name="help-circle-outline" size={20} color={colors.text} />
                <Text style={[commonStyles.text, { marginLeft: 12 }]}>Ajuda & Suporte</Text>
              </View>
              <Icon name="chevron-forward" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileButton: {
    marginRight: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  headerText: {
    flex: 1,
  },
  settingsButton: {
    padding: 8,
    borderRadius: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  progressInfo: {
    marginLeft: 24,
    flex: 1,
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
  },
  appointmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  appointmentInfo: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  taskIcon: {
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  quickAction: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    margin: '1%',
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  settingsContent: {
    flex: 1,
  },
  settingsSection: {
    marginBottom: 32,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
