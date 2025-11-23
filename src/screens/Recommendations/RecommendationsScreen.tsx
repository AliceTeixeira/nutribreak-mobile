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
import { recommendationService } from '../../services/modules/recommendation';
import { Recommendation } from '../../types';

export default function Recommendations() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const data = await recommendationService.getRecommendations();
      setRecommendations(data);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadRecommendations();
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await recommendationService.generateRecommendations();
      Alert.alert('Sucesso', 'Novas recomendações geradas!');
      loadRecommendations();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao gerar recomendações');
    } finally {
      setGenerating(false);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await recommendationService.completeRecommendation(id);
      loadRecommendations();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao completar recomendação');
    }
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      break: '⏰',
      meal: '🍽️',
      snack: '🍎',
      hydration: '💧',
    };
    return icons[type] || '💡';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      break: 'Pausa',
      meal: 'Refeição',
      snack: 'Lanche',
      hydration: 'Hidratação',
    };
    return labels[type] || type;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Header title="Recomendações" />
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Card>
          <Text style={styles.infoTitle}>Recomendações Personalizadas</Text>
          <Text style={styles.infoText}>
            Com base no seu humor e energia, a IA gera sugestões para melhorar seu bem-estar.
          </Text>
          <Button
            title="Gerar Novas Recomendações"
            onPress={handleGenerate}
            loading={generating}
            variant="primary"
          />
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ativas</Text>
          {recommendations.filter((r) => !r.completed).length > 0 ? (
            recommendations
              .filter((r) => !r.completed)
              .map((rec) => (
                <Card key={rec.id}>
                  <View style={styles.recHeader}>
                    <View style={styles.recIcon}>
                      <Text style={styles.iconText}>{getTypeIcon(rec.type)}</Text>
                    </View>
                    <View style={styles.recInfo}>
                      <Text style={styles.recType}>{getTypeLabel(rec.type)}</Text>
                      <Text style={styles.recTitle}>{rec.title}</Text>
                    </View>
                  </View>
                  <Text style={styles.recDescription}>{rec.description}</Text>
                  {rec.duration && (
                    <Text style={styles.recDuration}>⏱️ {rec.duration} minutos</Text>
                  )}
                  <Button
                    title="Marcar como Concluída"
                    onPress={() => handleComplete(rec.id)}
                    variant="outline"
                    style={styles.completeButton}
                  />
                </Card>
              ))
          ) : (
            <Card>
              <Text style={styles.noDataText}>Nenhuma recomendação ativa</Text>
            </Card>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Concluídas</Text>
          {recommendations.filter((r) => r.completed).length > 0 ? (
            recommendations
              .filter((r) => r.completed)
              .slice(0, 5)
              .map((rec) => (
                <Card key={rec.id} style={styles.completedCard}>
                  <View style={styles.recHeader}>
                    <View style={styles.recIcon}>
                      <Text style={styles.iconText}>{getTypeIcon(rec.type)}</Text>
                    </View>
                    <View style={styles.recInfo}>
                      <Text style={styles.recType}>{getTypeLabel(rec.type)}</Text>
                      <Text style={styles.recTitle}>{rec.title}</Text>
                    </View>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                </Card>
              ))
          ) : (
            <Card>
              <Text style={styles.noDataText}>Nenhuma recomendação concluída</Text>
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
  section: {
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  recHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  recIcon: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.secondary,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  iconText: {
    fontSize: 24,
  },
  recInfo: {
    flex: 1,
  },
  recType: {
    fontSize: SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  recTitle: {
    fontSize: SIZES.md,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 2,
  },
  recDescription: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  recDuration: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
  },
  completeButton: {
    marginTop: SPACING.sm,
  },
  completedCard: {
    opacity: 0.7,
  },
  checkmark: {
    fontSize: 24,
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
