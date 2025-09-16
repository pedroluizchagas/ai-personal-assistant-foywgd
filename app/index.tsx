
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import BottomTabBar from '../components/BottomTabBar';
import DashboardCard from '../components/DashboardCard';
import ProgressRing from '../components/ProgressRing';
import Icon from '../components/Icon';
import { mockTasks, mockGoals, mockExpenses, mockAppointments } from '../data/mockData';

export default function Dashboard() {
  const router = useRouter();

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
        <View>
          <Text style={commonStyles.title}>Dashboard</Text>
          <Text style={commonStyles.textSecondary}>
            Bem-vindo de volta! 👋
          </Text>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => console.log('Settings pressed')}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
});
