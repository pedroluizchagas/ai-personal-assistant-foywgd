
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { colors, commonStyles } from '../styles/commonStyles';
import BottomTabBar from '../components/BottomTabBar';
import Icon from '../components/Icon';
import { mockAppointments } from '../data/mockData';
import { Appointment } from '../types';

export default function Agenda() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Convert appointments to calendar format
  const markedDates = mockAppointments.reduce((acc, appointment) => {
    const dateKey = appointment.date.toISOString().split('T')[0];
    acc[dateKey] = {
      marked: true,
      dotColor: colors.primary,
      selectedColor: colors.primary,
    };
    return acc;
  }, {} as any);

  // Add selected date styling
  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: colors.primary,
    };
  }

  // Get appointments for selected date
  const selectedDateAppointments = mockAppointments.filter(appointment => {
    const appointmentDate = appointment.date.toISOString().split('T')[0];
    return appointmentDate === selectedDate;
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleAddAppointment = () => {
    console.log('Add appointment pressed');
    Alert.alert(
      'Nova Agenda',
      'Funcionalidade em desenvolvimento. Use o chat IA para criar compromissos.',
      [{ text: 'OK' }]
    );
  };

  const renderAppointment = (appointment: Appointment) => {
    return (
      <TouchableOpacity
        key={appointment.id}
        style={styles.appointmentItem}
        onPress={() => {
          console.log('Appointment pressed:', appointment.title);
          Alert.alert(
            appointment.title,
            `${appointment.description || 'Sem descrição'}\n\nHorário: ${formatTime(appointment.date)}\nDuração: ${appointment.duration} min${appointment.location ? `\nLocal: ${appointment.location}` : ''}`,
            [{ text: 'OK' }]
          );
        }}
      >
        <View style={styles.appointmentTime}>
          <Text style={styles.timeText}>{formatTime(appointment.date)}</Text>
          <Text style={styles.durationText}>{appointment.duration}min</Text>
        </View>
        <View style={styles.appointmentContent}>
          <Text style={styles.appointmentTitle}>{appointment.title}</Text>
          {appointment.description && (
            <Text style={styles.appointmentDescription}>{appointment.description}</Text>
          )}
          {appointment.location && (
            <View style={styles.locationContainer}>
              <Icon name="location-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.locationText}>{appointment.location}</Text>
            </View>
          )}
        </View>
        {appointment.reminder && (
          <View style={styles.reminderIcon}>
            <Icon name="notifications" size={16} color={colors.warning} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.title}>Agenda</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddAppointment}
        >
          <Icon name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Calendar */}
        <View style={commonStyles.card}>
          <Calendar
            current={selectedDate}
            onDayPress={(day) => {
              console.log('Selected date:', day.dateString);
              setSelectedDate(day.dateString);
            }}
            markedDates={markedDates}
            theme={{
              backgroundColor: 'transparent',
              calendarBackground: 'transparent',
              textSectionTitleColor: colors.text,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: colors.background,
              todayTextColor: colors.primary,
              dayTextColor: colors.text,
              textDisabledColor: colors.textSecondary,
              dotColor: colors.primary,
              selectedDotColor: colors.background,
              arrowColor: colors.primary,
              monthTextColor: colors.text,
              indicatorColor: colors.primary,
              textDayFontFamily: 'System',
              textMonthFontFamily: 'System',
              textDayHeaderFontFamily: 'System',
              textDayFontWeight: '400',
              textMonthFontWeight: '600',
              textDayHeaderFontWeight: '500',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
            firstDay={1}
            showWeekNumbers={false}
            hideExtraDays={true}
            disableMonthChange={false}
            hideDayNames={false}
            showScrollIndicator={false}
            enableSwipeMonths={true}
          />
        </View>

        {/* Selected Date Info */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>
            {formatDate(selectedDate)}
          </Text>
          
          {selectedDateAppointments.length > 0 ? (
            <View style={styles.appointmentsList}>
              {selectedDateAppointments
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map(renderAppointment)}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Icon name="calendar-outline" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>
                Nenhum compromisso para este dia
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Toque no + para adicionar um novo compromisso
              </Text>
            </View>
          )}
        </View>

        {/* Upcoming Appointments */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Próximos Compromissos</Text>
          
          {mockAppointments
            .filter(apt => apt.date > new Date())
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(0, 5)
            .map((appointment) => (
              <TouchableOpacity
                key={appointment.id}
                style={styles.upcomingItem}
                onPress={() => {
                  console.log('Upcoming appointment pressed:', appointment.title);
                  const appointmentDate = appointment.date.toISOString().split('T')[0];
                  setSelectedDate(appointmentDate);
                }}
              >
                <View style={styles.upcomingDate}>
                  <Text style={styles.upcomingDay}>
                    {appointment.date.getDate()}
                  </Text>
                  <Text style={styles.upcomingMonth}>
                    {appointment.date.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.upcomingContent}>
                  <Text style={styles.upcomingTitle}>{appointment.title}</Text>
                  <Text style={styles.upcomingTime}>
                    {formatTime(appointment.date)} • {appointment.duration}min
                  </Text>
                  {appointment.location && (
                    <Text style={styles.upcomingLocation}>
                      📍 {appointment.location}
                    </Text>
                  )}
                </View>
                <Icon name="chevron-forward" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
        </View>

        {/* Quick Actions */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.subtitle}>Ações Rápidas</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={handleAddAppointment}
            >
              <Icon name="add-circle" size={24} color={colors.primary} />
              <Text style={styles.quickActionText}>Novo Compromisso</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => {
                console.log('View week pressed');
                Alert.alert('Visualização Semanal', 'Funcionalidade em desenvolvimento');
              }}
            >
              <Icon name="calendar" size={24} color={colors.success} />
              <Text style={styles.quickActionText}>Ver Semana</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => {
                console.log('Reminders pressed');
                Alert.alert('Lembretes', 'Funcionalidade em desenvolvimento');
              }}
            >
              <Icon name="notifications" size={24} color={colors.warning} />
              <Text style={styles.quickActionText}>Lembretes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => {
                console.log('Sync calendar pressed');
                Alert.alert('Sincronizar', 'Funcionalidade em desenvolvimento');
              }}
            >
              <Icon name="sync" size={24} color={colors.secondary} />
              <Text style={styles.quickActionText}>Sincronizar</Text>
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
  addButton: {
    padding: 8,
    borderRadius: 8,
  },
  appointmentsList: {
    marginTop: 16,
  },
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  appointmentTime: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 60,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  durationText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  appointmentContent: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  appointmentDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  reminderIcon: {
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  upcomingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  upcomingDate: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 50,
  },
  upcomingDay: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  upcomingMonth: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  upcomingContent: {
    flex: 1,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  upcomingTime: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  upcomingLocation: {
    fontSize: 12,
    color: colors.textSecondary,
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
