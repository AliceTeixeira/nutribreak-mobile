import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Header, Card, Button, Loading } from '../../components';
import { COLORS, SPACING, SIZES, RADIUS } from '../../styles';
import { moodService } from '../../services/modules/mood';
import { MoodEntry } from '../../types';

const MOODS = [
  { value: 'excellent', label: 'Excelente', emoji: '😄' },
  { value: 'good', label: 'Bom', emoji: '🙂' },
  { value: 'neutral', label: 'Neutro', emoji: '😐' },
  { value: 'tired', label: 'Cansado', emoji: '😔' },
  { value: 'exhausted', label: 'Exausto', emoji: '😩' },
];

export default function Mood() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [energyLevel, setEnergyLevel] = useState(5);
  const [screenTime, setScreenTime] = useState(4);

  useEffect(() => {
    loadMoods();
  }, []);

  const loadMoods = async () => {
    try {
      const data = await moodService.getAllMoods();
      setMoodEntries(data);
    } catch (error: any) {
      if (error.message && !error.message.includes('autenticado')) {
      }
      setMoodEntries([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMoods();
  };

  const handleSaveMood = async () => {
    if (!selectedMood) {
      Alert.alert('Atenção', 'Selecione como você está se sentindo');
      return;
    }

    setSaving(true);
    try {
      await moodService.createMood({
        mood: selectedMood,
        energyLevel,
        screenTime,
      });
      Alert.alert('Sucesso', 'Humor registrado com sucesso!');
      setSelectedMood('');
      setEnergyLevel(5);
      setScreenTime(4);
      loadMoods();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao registrar humor');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMood = async (id: string) => {
    Alert.alert('Confirmar', 'Deseja excluir este registro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await moodService.deleteMood(id);
            loadMoods();
          } catch (error: any) {
            Alert.alert('Erro', error.message || 'Erro ao excluir registro');
          }
        },
      },
    ]);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Header title="Registro de Humor" />
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Card>
          <Text style={styles.sectionTitle}>Como você está se sentindo?</Text>
          <View style={styles.moodGrid}>
            {MOODS.map((mood) => (
              <TouchableOpacity
                key={mood.value}
                style={[
                  styles.moodButton,
                  selectedMood === mood.value && styles.moodButtonSelected,
                ]}
                onPress={() => setSelectedMood(mood.value)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text
                  style={[
                    styles.moodLabel,
                    selectedMood === mood.value && styles.moodLabelSelected,
                  ]}
                >
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Nível de Energia (1-10)</Text>
          <View style={styles.sliderContainer}>
            <View style={styles.levelButtons}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.levelButton,
                    energyLevel === level && styles.levelButtonSelected,
                  ]}
                  onPress={() => setEnergyLevel(level)}
                >
                  <Text
                    style={[
                      styles.levelText,
                      energyLevel === level && styles.levelTextSelected,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text style={styles.sectionTitle}>Tempo de Tela (horas)</Text>
          <View style={styles.sliderContainer}>
            <View style={styles.levelButtons}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((hours) => (
                <TouchableOpacity
                  key={hours}
                  style={[
                    styles.levelButton,
                    screenTime === hours && styles.levelButtonSelected,
                  ]}
                  onPress={() => setScreenTime(hours)}
                >
                  <Text
                    style={[
                      styles.levelText,
                      screenTime === hours && styles.levelTextSelected,
                    ]}
                  >
                    {hours}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Button title="Salvar Registro" onPress={handleSaveMood} loading={saving} />
        </Card>

        <Text style={styles.historyTitle}>Histórico</Text>
        {moodEntries.length > 0 ? (
          moodEntries.map((entry) => (
            <Card key={entry.id}>
              <View style={styles.entryHeader}>
                <View style={styles.entryInfo}>
                  <Text style={styles.entryMood}>
                    {MOODS.find((m) => m.value === entry.mood)?.emoji} {MOODS.find((m) => m.value === entry.mood)?.label}
                  </Text>
                  <Text style={styles.entryDate}>
                    {new Date(entry.date).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteMood(entry.id)}>
                  <Text style={styles.deleteButton}>🗑️</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.entryDetails}>
                Energia: {entry.energyLevel}/10 • Tela: {entry.screenTime}h
              </Text>
            </Card>
          ))
        ) : (
          <Card>
            <Text style={styles.noDataText}>Nenhum registro ainda</Text>
          </Card>
        )}
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
  sectionTitle: {
    fontSize: SIZES.md,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  moodButton: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  moodEmoji: {
    fontSize: 40,
    marginBottom: SPACING.xs,
  },
  moodLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
  },
  moodLabelSelected: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  sliderContainer: {
    marginBottom: SPACING.md,
  },
  levelButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  levelButton: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  levelButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  levelText: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
  },
  levelTextSelected: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  historyTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  entryInfo: {
    flex: 1,
  },
  entryMood: {
    fontSize: SIZES.md,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  entryDate: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },
  entryDetails: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
  },
  deleteButton: {
    fontSize: 24,
    padding: SPACING.xs,
  },
  noDataText: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
