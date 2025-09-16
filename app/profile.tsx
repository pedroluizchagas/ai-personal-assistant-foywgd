
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import BottomTabBar from '../components/BottomTabBar';
import Icon from '../components/Icon';

export default function Profile() {
  const router = useRouter();

  const subscriptionPlan = {
    name: 'Premium',
    price: 'R$ 29,90/mês',
    features: [
      'Chat IA ilimitado',
      'Sincronização em nuvem',
      'Relatórios avançados',
      'Suporte prioritário',
      'Backup automático'
    ],
    nextBilling: new Date(2025, 0, 15)
  };

  const userStats = {
    tasksCompleted: 127,
    goalsAchieved: 8,
    daysActive: 45,
    notesCreated: 23
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            console.log('Back button pressed - returning to dashboard');
            router.back();
          }}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[commonStyles.title, { fontSize: 20, marginBottom: 0 }]}>Perfil</Text>
        <TouchableOpacity style={styles.editButton}>
          <Icon name="create-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={[commonStyles.card, styles.profileCard]}>
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face' }}
              style={styles.profileImageLarge}
            />
            <View style={styles.profileInfo}>
              <Text style={[commonStyles.text, { fontSize: 24, fontWeight: '700' }]}>
                João Silva
              </Text>
              <Text style={commonStyles.textSecondary}>
                joao.silva@email.com
              </Text>
              <Text style={[commonStyles.textSecondary, { marginTop: 4 }]}>
                Membro desde Nov 2024
              </Text>
            </View>
          </View>
        </View>

        {/* Subscription Plan */}
        <View style={commonStyles.card}>
          <View style={styles.sectionHeader}>
            <Text style={commonStyles.subtitle}>Plano de Assinatura</Text>
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>{subscriptionPlan.name}</Text>
            </View>
          </View>
          
          <View style={styles.planDetails}>
            <Text style={[commonStyles.text, { fontSize: 18, fontWeight: '600' }]}>
              {subscriptionPlan.price}
            </Text>
            <Text style={commonStyles.textSecondary}>
              Próxima cobrança: {subscriptionPlan.nextBilling.toLocaleDateString('pt-BR')}
            </Text>
          </View>

          <View style={styles.featuresContainer}>
            <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 12 }]}>
              Recursos inclusos:
            </Text>
            {subscriptionPlan.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Icon name="checkmark-circle" size={16} color={colors.success} />
                <Text style={[commonStyles.textSecondary, { marginLeft: 8 }]}>
                  {feature}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.manageButton}>
            <Text style={[commonStyles.text, { color: colors.primary, fontWeight: '600' }]}>
              Gerenciar Assinatura
            </Text>
            <Icon name="chevron-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* User Statistics */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Estatísticas</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.tasksCompleted}</Text>
              <Text style={commonStyles.textSecondary}>Tarefas Concluídas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.goalsAchieved}</Text>
              <Text style={commonStyles.textSecondary}>Metas Alcançadas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.daysActive}</Text>
              <Text style={commonStyles.textSecondary}>Dias Ativos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.notesCreated}</Text>
              <Text style={commonStyles.textSecondary}>Notas Criadas</Text>
            </View>
          </View>
        </View>

        {/* Account Settings */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Configurações da Conta</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="person-outline" size={20} color={colors.text} />
              <Text style={[commonStyles.text, { marginLeft: 12 }]}>Informações Pessoais</Text>
            </View>
            <Icon name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="lock-closed-outline" size={20} color={colors.text} />
              <Text style={[commonStyles.text, { marginLeft: 12 }]}>Segurança</Text>
            </View>
            <Icon name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="card-outline" size={20} color={colors.text} />
              <Text style={[commonStyles.text, { marginLeft: 12 }]}>Métodos de Pagamento</Text>
            </View>
            <Icon name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="download-outline" size={20} color={colors.text} />
              <Text style={[commonStyles.text, { marginLeft: 12 }]}>Exportar Dados</Text>
            </View>
            <Icon name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { color: colors.error }]}>Zona de Perigo</Text>
          
          <TouchableOpacity style={[styles.settingItem, { borderBottomWidth: 0 }]}>
            <View style={styles.settingLeft}>
              <Icon name="log-out-outline" size={20} color={colors.error} />
              <Text style={[commonStyles.text, { marginLeft: 12, color: colors.error }]}>
                Sair da Conta
              </Text>
            </View>
            <Icon name="chevron-forward" size={16} color={colors.error} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
  },
  profileCard: {
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
  },
  profileImageLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  planBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  planBadgeText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '600',
  },
  planDetails: {
    marginBottom: 20,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    marginBottom: 20,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
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
});
