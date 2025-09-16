
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

  const todayAppointments = mockAppointments.filter(apt => {
    const today = new Date();
    const aptDate = apt.date;
    return aptDate.toDateString() === today.toDateString();
  });

  const upcomingAppointments = mockAppointments
    .filter(apt => apt.date > new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);

  const goalProgress = mockGoals.length > 0 
    ? mockGoals.reduce((sum, goal) => sum + (goal.currentValue / goal.targetValue), 0) / mockGoals.length 
    : 0;

  const formatCurrency = (amount: number) => {
    return `R$ ${amount.toFixed(2).replace('.', ',')}`;
  };

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
            value={formatCurrency(balance)}
            icon="card-outline"
            color={balance >= 0 ? colors.success : colors.error}
            onPress={() => router.push('/finances')}
          />
        </View>

        {/* Financial Summary */}
        <View style={commonStyles.card}>
          <View style={commonStyles.spaceBetween}>
            <Text style={commonStyles.subtitle}>Resumo Financeiro</Text>
            <TouchableOpacity onPress={() => router.push('/finances')}>
              <Text style={[commonStyles.textSecondary, { color: colors.primary }]}>
                Ver detalhes
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.financialSummary}>
            <View style={styles.financialItem}>
              <View style={[styles.financialIcon, { backgroundColor: colors.success + '20' }]}>
                <Icon name="arrow-down" size={20} color={colors.success} />
              </View>
              <View style={styles.financialInfo}>
                <Text style={commonStyles.textSecondary}>Receitas</Text>
                <Text style={[commonStyles.text, { fontWeight: '700', color: colors.success }]}>
                  {formatCurrency(totalIncome)}
                </Text>
              </View>
            </View>
            
            <View style={styles.financialItem}>
              <View style={[styles.financialIcon, { backgroundColor: colors.error + '20' }]}>
                <Icon name="arrow-up" size={20} color={colors.error} />
              </View>
              <View style={styles.financialInfo}>
                <Text style={commonStyles.textSecondary}>Gastos</Text>
                <Text style={[commonStyles.text, { fontWeight: '700', color: colors.error }]}>
                  {formatCurrency(totalExpenses)}
                </Text>
              </View>
            </View>
          </View>

          {/* Recent Transactions */}
          <View style={styles.recentTransactions}>
            <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 12 }]}>
              Transações Recentes
            </Text>
            {mockExpenses
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .slice(0, 3)
              .map((expense) => (
                <View key={expense.id} style={styles.transactionItem}>
                  <View style={[
                    styles.transactionIcon,
                    { backgroundColor: expense.type === 'income' ? colors.success + '20' : colors.error + '20' }
                  ]}>
                    <Icon 
                      name={expense.type === 'income' ? 'add' : 'remove'} 
                      size={16} 
                      color={expense.type === 'income' ? colors.success : colors.error} 
                    />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={[commonStyles.text, { fontWeight: '500' }]}>
                      {expense.description}
                    </Text>
                    <Text style={commonStyles.textSecondary}>
                      {expense.category}
                    </Text>
                  </View>
                  <Text style={[
                    commonStyles.text,
                    { 
                      fontWeight: '600',
                      color: expense.type === 'income' ? colors.success : colors.error
                    }
                  ]}>
                    {expense.type === 'income' ? '+' : '-'}{formatCurrency(expense.amount)}
                  </Text>
                </View>
              ))}
          </View>
        </View>

        {/* Agenda Summary */}
        <View style={commonStyles.card}>
          <View style={commonStyles.spaceBetween}>
            <Text style={commonStyles.subtitle}>Próximos Compromissos</Text>
            <TouchableOpacity onPress={() => router.push('/agenda')}>
              <Text style={[commonStyles.textSecondary, { color: colors.primary }]}>
                Ver agenda
              </Text>
            </TouchableOpacity>
          </View>
          
          {upcomingAppointments.length > 0 ? (
            <View style={styles.agendaSummary}>
              {upcomingAppointments.map((appointment) => (
                <TouchableOpacity
                  key={appointment.id}
                  style={styles.appointmentSummaryItem}
                  onPress={() => router.push('/agenda')}
                >
                  <View style={styles.appointmentDate}>
                    <Text style={styles.dateDay}>
                      {appointment.date.getDate()}
                    </Text>
                    <Text style={styles.dateMonth}>
                      {appointment.date.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.appointmentDetails}>
                    <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                      {appointment.title}
                    </Text>
                    <Text style={commonStyles.textSecondary}>
                      {appointment.date.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })} • {appointment.duration}min
                    </Text>
                    {appointment.location && (
                      <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                        📍 {appointment.location}
                      </Text>
                    )}
                  </View>
                  <Icon name="chevron-forward" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyAgenda}>
              <Icon name="calendar-outline" size={32} color={colors.textSecondary} />
              <Text style={[commonStyles.textSecondary, { marginTop: 8 }]}>
                Nenhum compromisso próximo
              </Text>
            </View>
          )}
        </View>

        {/* Today's Appointments */}
        {todayAppointments.length > 0 && (
          <View style={commonStyles.card}>
            <View style={commonStyles.spaceBetween}>
              <Text style={commonStyles.subtitle}>Compromissos de Hoje</Text>
              <TouchableOpacity onPress={() => router.push('/agenda')}>
                <Text style={[commonStyles.textSecondary, { color: colors.primary }]}>
                  Ver agenda
                </Text>
              </TouchableOpacity>
            </View>
            
            {todayAppointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.appointmentIcon}>
                  <Icon name="calendar" size={20} color={colors.primary} />
                </View>
                <View style={styles.appointmentInfo}>
                  <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                    {appointment.title}
                  </Text>
                  <Text style={commonStyles.textSecondary}>
                    {appointment.date.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })} • {appointment.duration}min
                  </Text>
                  {appointment.location && (
                    <Text style={commonStyles.textSecondary}>
                      📍 {appointment.location}
                    </Text>
                  )}
                </View>
                {appointment.reminder && (
                  <Icon name="notifications" size={16} color={colors.warning} />
                )}
              </View>
            ))}
          </View>
        )}

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
              onPress={() => router.push('/agenda')}
            >
              <Icon name="calendar" size={24} color={colors.success} />
              <Text style={styles.quickActionText}>Nova Agenda</Text>
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
  financialSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 20,
  },
  financialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  financialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  financialInfo: {
    flex: 1,
  },
  recentTransactions: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  agendaSummary: {
    marginTop: 16,
  },
  appointmentSummaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  appointmentDate: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 50,
  },
  dateDay: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  dateMonth: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  appointmentDetails: {
    flex: 1,
  },
  emptyAgenda: {
    alignItems: 'center',
    paddingVertical: 32,
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
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
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
