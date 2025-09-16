
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/commonStyles';
import BottomTabBar from '../components/BottomTabBar';
import Icon from '../components/Icon';
import { mockTasks, mockGoals } from '../data/mockData';
import { Task, Goal } from '../types';

export default function Tasks() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'goals'>('tasks');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Normal';
    }
  };

  const renderTask = (task: Task) => (
    <View key={task.id} style={commonStyles.smallCard}>
      <View style={styles.taskHeader}>
        <TouchableOpacity style={styles.checkbox}>
          <Icon 
            name={task.completed ? "checkmark-circle" : "ellipse-outline"} 
            size={24} 
            color={task.completed ? colors.success : colors.textSecondary} 
          />
        </TouchableOpacity>
        <View style={styles.taskInfo}>
          <Text style={[
            commonStyles.text,
            { fontWeight: '600' },
            task.completed && styles.completedTask
          ]}>
            {task.title}
          </Text>
          {task.description && (
            <Text style={[commonStyles.textSecondary, task.completed && styles.completedTask]}>
              {task.description}
            </Text>
          )}
          <View style={styles.taskMeta}>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) + '20' }]}>
              <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                {getPriorityLabel(task.priority)}
              </Text>
            </View>
            {task.dueDate && (
              <Text style={commonStyles.textSecondary}>
                📅 {task.dueDate.toLocaleDateString('pt-BR')}
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Icon name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderGoal = (goal: Goal) => {
    const progress = goal.currentValue / goal.targetValue;
    const progressPercentage = Math.min(progress * 100, 100);

    return (
      <View key={goal.id} style={commonStyles.smallCard}>
        <View style={styles.goalHeader}>
          <Text style={[commonStyles.text, { fontWeight: '600' }]}>
            {goal.title}
          </Text>
          <View style={[styles.categoryBadge, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.categoryText, { color: colors.primary }]}>
              {goal.category}
            </Text>
          </View>
        </View>
        
        {goal.description && (
          <Text style={[commonStyles.textSecondary, { marginVertical: 8 }]}>
            {goal.description}
          </Text>
        )}

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { 
                  width: `${progressPercentage}%`,
                  backgroundColor: goal.completed ? colors.success : colors.primary
                }
              ]} 
            />
          </View>
          <Text style={[commonStyles.textSecondary, { marginLeft: 12 }]}>
            {progressPercentage.toFixed(0)}%
          </Text>
        </View>

        <View style={styles.goalMeta}>
          <Text style={commonStyles.text}>
            {goal.currentValue} / {goal.targetValue} {goal.unit}
          </Text>
          {goal.deadline && (
            <Text style={commonStyles.textSecondary}>
              🎯 {goal.deadline.toLocaleDateString('pt-BR')}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const completedTasks = mockTasks.filter(task => task.completed).length;
  const pendingTasks = mockTasks.filter(task => !task.completed).length;
  const completedGoals = mockGoals.filter(goal => goal.completed).length;
  const activeGoals = mockGoals.filter(goal => !goal.completed).length;

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.title}>
          {activeTab === 'tasks' ? 'Tarefas' : 'Metas'}
        </Text>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="add" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'tasks' && styles.tabButtonActive
          ]}
          onPress={() => setActiveTab('tasks')}
        >
          <Text style={[
            styles.tabButtonText,
            activeTab === 'tasks' && styles.tabButtonTextActive
          ]}>
            Tarefas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'goals' && styles.tabButtonActive
          ]}
          onPress={() => setActiveTab('goals')}
        >
          <Text style={[
            styles.tabButtonText,
            activeTab === 'goals' && styles.tabButtonTextActive
          ]}>
            Metas
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsContainer}>
          {activeTab === 'tasks' ? (
            <>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{pendingTasks}</Text>
                <Text style={commonStyles.textSecondary}>Pendentes</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statNumber, { color: colors.success }]}>
                  {completedTasks}
                </Text>
                <Text style={commonStyles.textSecondary}>Concluídas</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{activeGoals}</Text>
                <Text style={commonStyles.textSecondary}>Ativas</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statNumber, { color: colors.success }]}>
                  {completedGoals}
                </Text>
                <Text style={commonStyles.textSecondary}>Concluídas</Text>
              </View>
            </>
          )}
        </View>

        {/* Content */}
        {activeTab === 'tasks' ? (
          <>
            {/* Pending Tasks */}
            <View style={commonStyles.card}>
              <Text style={commonStyles.subtitle}>Tarefas Pendentes</Text>
              {mockTasks
                .filter(task => !task.completed)
                .sort((a, b) => {
                  const priorityOrder = { high: 3, medium: 2, low: 1 };
                  return priorityOrder[b.priority as keyof typeof priorityOrder] - 
                         priorityOrder[a.priority as keyof typeof priorityOrder];
                })
                .map(renderTask)}
            </View>

            {/* Completed Tasks */}
            {completedTasks > 0 && (
              <View style={commonStyles.card}>
                <Text style={commonStyles.subtitle}>Tarefas Concluídas</Text>
                {mockTasks
                  .filter(task => task.completed)
                  .map(renderTask)}
              </View>
            )}
          </>
        ) : (
          <>
            {/* Active Goals */}
            <View style={commonStyles.card}>
              <Text style={commonStyles.subtitle}>Metas Ativas</Text>
              {mockGoals
                .filter(goal => !goal.completed)
                .map(renderGoal)}
            </View>

            {/* Completed Goals */}
            {completedGoals > 0 && (
              <View style={commonStyles.card}>
                <Text style={commonStyles.subtitle}>Metas Concluídas</Text>
                {mockGoals
                  .filter(goal => goal.completed)
                  .map(renderGoal)}
              </View>
            )}
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addButton: {
    padding: 8,
    borderRadius: 8,
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  tabButtonTextActive: {
    color: colors.background,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  taskInfo: {
    flex: 1,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  moreButton: {
    padding: 4,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
