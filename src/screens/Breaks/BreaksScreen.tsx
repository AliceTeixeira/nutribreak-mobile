import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Header, Card, Button, Loading } from '../../components';
import { COLORS, SPACING, SIZES } from '../../styles';
import { breakService } from '../../services/modules/break';
import { Break } from '../../types';

export default function Breaks() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [breaks, setBreaks] = useState<Break[]>([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadBreaks();
  }, []);

  const loadBreaks = async () => {
    try {
      const data = await breakService.getAllBreaks();
      setBreaks(data);
    } catch (error) {
      console.error('Error loading breaks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadBreaks();
  };

  const handleCreateBreak = async (type: 'short' | 'long') => {
    setCreating(true);
    try {
      const duration = type === 'short' ? 5 : 15;
      const scheduledFor = new Date(Date.now() + 30 * 60 * 1000).toISOString();

      await breakService.createBreak({
        type,
        duration,
        scheduledFor,
      });

      Alert.alert('Sucesso', `Pausa ${type === 'short' ? 'curta' : 'longa'} agendada!`);
      loadBreaks();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao criar pausa');
    } finally {
      setCreating(false);
    }
  };

  const handleCompleteBreak = async (id: string) => {
    try {
      await breakService.completeBreak(id);
      Alert.alert('Ótimo!', 'Pausa completada com sucesso!');
      loadBreaks();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao completar pausa');
    }
  };

  const handleSkipBreak = async (id: string) => {
    Alert.alert('Confirmar', 'Deseja pular esta pausa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Pular',
        onPress: async () => {
          try {
            await breakService.skipBreak(id);
            loadBreaks();
          } catch (error: any) {
            Alert.alert('Erro', error.message || 'Erro ao pular pausa');
          }
        },
      },
    ]);
  };

  const pendingBreaks = breaks.filter((b) => !b.completedAt && !b.skipped);
  const completedBreaks = breaks.filter((b) => b.completedAt);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Header title="Pausas Inteligentes" />
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Card>
          <Text style={styles.infoTitle}>Agendar Pausa</Text>
          <Text style={styles.infoText}>
            Pausas regulares são essenciais para manter a produtividade e bem-estar.
          </Text>
          <View style={styles.buttonsRow}>
            <Button
              title="Pausa Curta (5min)"
              onPress={() => handleCreateBreak('short')}
              loading={creating}
              style={styles.halfButton}
            />
            <Button
              title="Pausa Longa (15min)"
              onPress={() => handleCreateBreak('long')}
              loading={creating}
              variant="outline"
              style={styles.halfButton}
            />
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pausas Agendadas</Text>
          {pendingBreaks.length > 0 ? (
            pendingBreaks.map((breakItem) => (
              <Card key={breakItem.id}>
                <View style={styles.breakHeader}>
                  <View style={styles.breakIcon}>
                    <Text style={styles.iconText}>
                      {breakItem.type === 'short' ? '☕' : '🧘'}
                    </Text>
                  </View>
                  <View style={styles.breakInfo}>
                    <Text style={styles.breakType}>
                      {breakItem.type === 'short' ? 'Pausa Curta' : 'Pausa Longa'}
                    </Text>
                    <Text style={styles.breakDuration}>{breakItem.duration} minutos</Text>
                    <Text style={styles.breakTime}>
                      {new Date(breakItem.scheduledFor).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                </View>
                <View style={styles.breakActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleCompleteBreak(breakItem.id)}
                  >
                    <Text style={styles.actionButtonText}>✓ Concluir</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.skipButton]}
                    onPress={() => handleSkipBreak(breakItem.id)}
                  >
                    <Text style={styles.skipButtonText}>⏭ Pular</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            ))
          ) : (
            <Card>
              <Text style={styles.noDataText}>Nenhuma pausa agendada</Text>
            </Card>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Histórico</Text>
          {completedBreaks.length > 0 ? (
            completedBreaks.slice(0, 10).map((breakItem) => (
              <Card key={breakItem.id} style={styles.completedCard}>
                <View style={styles.breakHeader}>
                  <View style={styles.breakIcon}>
                    <Text style={styles.iconText}>
                      {breakItem.type === 'short' ? '☕' : '🧘'}
                    </Text>
                  </View>
                  <View style={styles.breakInfo}>
                    <Text style={styles.breakType}>
                      {breakItem.type === 'short' ? 'Pausa Curta' : 'Pausa Longa'}
                    </Text>
                    <Text style={styles.breakDuration}>{breakItem.duration} minutos</Text>
                    <Text style={styles.breakTime}>
                      Concluída em{' '}
                      {breakItem.completedAt &&
                        new Date(breakItem.completedAt).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              </Card>
            ))
          ) : (
            <Card>
              <Text style={styles.noDataText}>Nenhuma pausa concluída ainda</Text>
            </Card>
          )}
        </View>
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
  infoTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  infoText: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  halfButton: {
    flex: 1,
  },
  section: {
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  breakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  breakIcon: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.secondary,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  iconText: {
    fontSize: 32,
  },
  breakInfo: {
    flex: 1,
  },
  breakType: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  breakDuration: {
    fontSize: SIZES.md,
    color: COLORS.primary,
    marginTop: 2,
  },
  breakTime: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },
  breakActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: SIZES.md,
    fontWeight: '600',
  },
  skipButton: {
    backgroundColor: COLORS.gray,
  },
  skipButtonText: {
    color: COLORS.white,
    fontSize: SIZES.md,
    fontWeight: '600',
  },
  completedCard: {
    opacity: 0.7,
  },
  checkmark: {
    fontSize: 32,
    color: COLORS.success,
    fontWeight: 'bold',
  },
  noDataText: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
