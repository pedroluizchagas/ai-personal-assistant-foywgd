
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/commonStyles';
import BottomTabBar from '../components/BottomTabBar';
import Icon from '../components/Icon';
import { mockExpenses } from '../data/mockData';
import { Expense } from '../types';

export default function Finances() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Calculate totals
  const totalIncome = mockExpenses
    .filter(expense => expense.type === 'income')
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const totalExpenses = mockExpenses
    .filter(expense => expense.type === 'expense')
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const balance = totalIncome - totalExpenses;

  // Group expenses by category
  const expensesByCategory = mockExpenses
    .filter(expense => expense.type === 'expense')
    .reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

  const incomeByCategory = mockExpenses
    .filter(expense => expense.type === 'income')
    .reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

  const formatCurrency = (amount: number) => {
    return `R$ ${amount.toFixed(2).replace('.', ',')}`;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Alimentação': 'restaurant',
      'Utilidades': 'flash',
      'Trabalho': 'briefcase',
      'Transporte': 'car',
      'Saúde': 'medical',
      'Lazer': 'game-controller',
    };
    return icons[category] || 'card';
  };

  const renderExpenseItem = (expense: Expense) => (
    <View key={expense.id} style={styles.transactionItem}>
      <View style={[
        styles.categoryIcon,
        { backgroundColor: expense.type === 'income' ? colors.success + '20' : colors.error + '20' }
      ]}>
        <Icon 
          name={getCategoryIcon(expense.category) as any} 
          size={20} 
          color={expense.type === 'income' ? colors.success : colors.error} 
        />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={[commonStyles.text, { fontWeight: '600' }]}>
          {expense.description}
        </Text>
        <Text style={commonStyles.textSecondary}>
          {expense.category} • {expense.date.toLocaleDateString('pt-BR')}
        </Text>
      </View>
      <Text style={[
        commonStyles.text,
        { 
          fontWeight: '700',
          color: expense.type === 'income' ? colors.success : colors.error
        }
      ]}>
        {expense.type === 'income' ? '+' : '-'}{formatCurrency(expense.amount)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.title}>Finanças</Text>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="add" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View style={[commonStyles.card, styles.balanceCard]}>
          <Text style={commonStyles.textSecondary}>Saldo Total</Text>
          <Text style={[
            styles.balanceAmount,
            { color: balance >= 0 ? colors.success : colors.error }
          ]}>
            {formatCurrency(balance)}
          </Text>
          
          <View style={styles.balanceDetails}>
            <View style={styles.balanceItem}>
              <View style={styles.balanceIcon}>
                <Icon name="arrow-down" size={16} color={colors.success} />
              </View>
              <View>
                <Text style={commonStyles.textSecondary}>Receitas</Text>
                <Text style={[commonStyles.text, { color: colors.success, fontWeight: '600' }]}>
                  {formatCurrency(totalIncome)}
                </Text>
              </View>
            </View>
            
            <View style={styles.balanceItem}>
              <View style={[styles.balanceIcon, { backgroundColor: colors.error + '20' }]}>
                <Icon name="arrow-up" size={16} color={colors.error} />
              </View>
              <View>
                <Text style={commonStyles.textSecondary}>Gastos</Text>
                <Text style={[commonStyles.text, { color: colors.error, fontWeight: '600' }]}>
                  {formatCurrency(totalExpenses)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {['week', 'month', 'year'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.periodButtonTextActive
              ]}>
                {period === 'week' ? 'Semana' : period === 'month' ? 'Mês' : 'Ano'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Expenses by Category */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Gastos por Categoria</Text>
          {Object.entries(expensesByCategory).map(([category, amount]) => {
            const percentage = (amount / totalExpenses) * 100;
            return (
              <View key={category} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryInfo}>
                    <View style={[styles.categoryIcon, { backgroundColor: colors.error + '20' }]}>
                      <Icon name={getCategoryIcon(category) as any} size={16} color={colors.error} />
                    </View>
                    <Text style={commonStyles.text}>{category}</Text>
                  </View>
                  <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                    {formatCurrency(amount)}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { width: `${percentage}%`, backgroundColor: colors.error }
                    ]} 
                  />
                </View>
                <Text style={commonStyles.textSecondary}>
                  {percentage.toFixed(1)}% do total
                </Text>
              </View>
            );
          })}
        </View>

        {/* Income by Category */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Receitas por Categoria</Text>
          {Object.entries(incomeByCategory).map(([category, amount]) => {
            const percentage = (amount / totalIncome) * 100;
            return (
              <View key={category} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryInfo}>
                    <View style={[styles.categoryIcon, { backgroundColor: colors.success + '20' }]}>
                      <Icon name={getCategoryIcon(category) as any} size={16} color={colors.success} />
                    </View>
                    <Text style={commonStyles.text}>{category}</Text>
                  </View>
                  <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                    {formatCurrency(amount)}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { width: `${percentage}%`, backgroundColor: colors.success }
                    ]} 
                  />
                </View>
                <Text style={commonStyles.textSecondary}>
                  {percentage.toFixed(1)}% do total
                </Text>
              </View>
            );
          })}
        </View>

        {/* Recent Transactions */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Transações Recentes</Text>
          {mockExpenses
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 10)
            .map(renderExpenseItem)}
        </View>

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
  balanceCard: {
    alignItems: 'center',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '800',
    marginVertical: 8,
  },
  balanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
  },
  balanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  periodButtonTextActive: {
    color: colors.background,
  },
  categoryItem: {
    marginVertical: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
  },
});
