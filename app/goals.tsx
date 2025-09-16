
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import BottomTabBar from '../components/BottomTabBar';
import ProgressRing from '../components/ProgressRing';
import Icon from '../components/Icon';
import { mockGoals } from '../data/mockData';
import { Goal } from '../types';

export default function Goals() {
  const router = useRouter();

  const renderGoal = (goal: Goal) => {
    const progress = goal.currentValue / goal.targetValue;
    const progressPercentage = Math.min(progress * 100, 100);
    const isOverdue = goal.deadline && goal.deadline < new Date() && !goal.completed;

    return (
      <View key={goal.id} style={commonStyles.card}>
        <View style={styles.goalHeader}>
          <View style={styles.goalInfo}>
            <Text style={[commonStyles.text, { fontWeight: '600', fontSize: 18 }]}>
              {goal.title}
            </Text>
            <View style={[styles.categoryBadge, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.categoryText, { color: colors.primary }]}>
                {goal.category}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Icon name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        {goal.description && (
          <Text style={[commonStyles.textSecondary, { marginBottom: 16 }]}>
            {goal.description}
          </Text>
        )}

        <View style={styles.progressSection}>
          <ProgressRing 
            progress={progress} 
            size={80}
            color={goal.completed ? colors.success : isOverdue ? colors.error : colors.primary}
          >
            <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 16 }]}>
              {progressPercentage.toFixed(0)}%
            </Text>
          </ProgressRing>
          
          <View style={styles.progressDetails}>
            <Text style={[commonStyles.text, { fontSize: 24, fontWeight: '700' }]}>
              {goal.currentValue} / {goal.targetValue}
            </Text>
            <Text style={commonStyles.textSecondary}>
              {goal.unit}
            </Text>
            {goal.deadline && (
              <Text style={[
                commonStyles.textSecondary,
                { marginTop: 8 },
                isOverdue && { color: colors.error }
              ]}>
                🎯 {goal.deadline.toLocaleDateString('pt-BR')}
                {isOverdue && ' (Atrasado)'}
              </Text>
            )}
          </View>
        </View>

        {goal.completed && (
          <View style={styles.completedBadge}>
            <Icon name="checkmark-circle" size={16} color={colors.success} />
            <Text style={[styles.completedText, { color: colors.success }]}>
              Concluída
            </Text>
          </View>
        )}
      </View>
    );
  };

  const activeGoals = mockGoals.filter(goal => !goal.completed);
  const completedGoals = mockGoals.filter(goal => goal.completed);
  const overallProgress = mockGoals.length > 0 
    ? mockGoals.reduce((sum, goal) => sum + Math.min(goal.currentValue / goal.targetValue, 1), 0) / mockGoals.length 
    : 0;

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={commonStyles.title}>Metas</Text>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="add" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Overall Progress */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Progresso Geral</Text>
          <View style={styles.overallProgress}>
            <ProgressRing progress={overallProgress} size={100} color={colors.primary}>
              <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 18 }]}>
                {Math.round(overallProgress * 100)}%
              </Text>
            </ProgressRing>
            <View style={styles.overallStats}>
              <View style={styles.statItem}>
                <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 20 }]}>
                  {activeGoals.length}
                </Text>
                <Text style={commonStyles.textSecondary}>Ativas</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[commonStyles.text, { fontWeight: '700', fontSize: 20, color: colors.success }]}>
                  {completedGoals.length}
                </Text>
                <Text style={commonStyles.textSecondary}>Concluídas</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Active Goals */}
        {activeGoals.length > 0 && (
          <>
            <Text style={[commonStyles.subtitle, { marginVertical: 16 }]}>
              Metas Ativas ({activeGoals.length})
            </Text>
            {activeGoals.map(renderGoal)}
          </>
        )}

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <>
            <Text style={[commonStyles.subtitle, { marginVertical: 16 }]}>
              Metas Concluídas ({completedGoals.length})
            </Text>
            {completedGoals.map(renderGoal)}
          </>
        )}

        {mockGoals.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="flag-outline" size={64} color={colors.textSecondary} />
            <Text style={[commonStyles.text, { textAlign: 'center', marginTop: 16 }]}>
              Nenhuma meta criada ainda
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
              Defina suas metas e acompanhe seu progresso
            </Text>
          </View>
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
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  goalInfo: {
    flex: 1,
    marginRight: 12,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  moreButton: {
    padding: 4,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDetails: {
    marginLeft: 24,
    flex: 1,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 8,
    backgroundColor: colors.success + '20',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  completedText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  overallProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  overallStats: {
    marginLeft: 32,
    flex: 1,
  },
  statItem: {
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
});
