import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../core/providers';
import { Header, Card, Loading } from '../../components';
import { COLORS, SPACING, SIZES } from '../../styles';
import { moodService } from '../../services/modules/mood';
import { breakService } from '../../services/modules/break';
import { MoodEntry, Break } from '../../types';

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [todayMood, setTodayMood] = useState<MoodEntry | null>(null);
  const [upcomingBreaks, setUpcomingBreaks] = useState<Break[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [moods, breaks] = await Promise.all([
        moodService.getAllMoods(),
        breakService.getAllBreaks(),
      ]);

      const today = new Date().toISOString().split('T')[0];
      const todayMoodEntry = moods.find((m) => m.date.startsWith(today));
      setTodayMood(todayMoodEntry || null);

      const upcoming = breaks
        .filter((b) => !b.completedAt && !b.skipped)
        .slice(0, 3);
      setUpcomingBreaks(upcoming);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const getMoodEmoji = (mood: string) => {
    const emojis: Record<string, string> = {
      excellent: '😄',
      good: '🙂',
      neutral: '😐',
      tired: '😔',
      exhausted: '😩',
    };
    return emojis[mood] || '😐';
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Header title="Dashboard" />
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Olá, {user?.name?.split(' ')[0] || 'Usuário'}!</Text>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </Text>
        </View>

        <Card>
          <Text style={styles.cardTitle}>Como você está hoje?</Text>
          {todayMood ? (
            <View style={styles.moodDisplay}>
              <Text style={styles.moodEmoji}>{getMoodEmoji(todayMood.mood)}</Text>
              <View>
                <Text style={styles.moodLabel}>Humor registrado</Text>
                <Text style={styles.moodValue}>Energia: {todayMood.energyLevel}/10</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.noDataText}>Você ainda não registrou seu humor hoje</Text>
          )}
        </Card>

        <Card>
          <Text style={styles.cardTitle}>Próximas Pausas</Text>
          {upcomingBreaks.length > 0 ? (
            upcomingBreaks.map((breakItem) => (
              <View key={breakItem.id} style={styles.breakItem}>
                <View style={styles.breakIcon}>
                  <Text style={styles.breakEmoji}>{breakItem.type === 'short' ? '☕' : '🧘'}</Text>
                </View>
                <View style={styles.breakInfo}>
                  <Text style={styles.breakType}>
                    {breakItem.type === 'short' ? 'Pausa Curta' : 'Pausa Longa'}
                  </Text>
                  <Text style={styles.breakTime}>{breakItem.duration} minutos</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>Nenhuma pausa agendada</Text>
          )}
        </Card>

        <Card>
          <Text style={styles.cardTitle}>Estatísticas da Semana</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>85%</Text>
              <Text style={styles.statLabel}>Pausas Realizadas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Registros de Humor</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>Dica do Dia</Text>
          <Text style={styles.tipText}>
            💧 Lembre-se de se hidratar! Beba pelo menos 2 litros de água hoje.
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  welcomeSection: {
    marginBottom: SPACING.lg,
  },
  welcomeText: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  dateText: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    textTransform: 'capitalize',
  },
  cardTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  moodDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 60,
    marginRight: SPACING.md,
  },
  moodLabel: {
    fontSize: SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  moodValue: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  noDataText: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  breakItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  breakIcon: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.secondary,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  breakEmoji: {
    fontSize: 24,
  },
  breakInfo: {
    flex: 1,
  },
  breakType: {
    fontSize: SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  breakTime: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  tipText: {
    fontSize: SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
  },
});
