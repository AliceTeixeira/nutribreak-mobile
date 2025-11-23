import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../core/providers';
import { Header, Card, Button, Loading } from '../../components';
import { COLORS, SPACING, SIZES } from '../../styles';
import { settingsService } from '../../services/modules/settings';
import { Settings as SettingsType } from '../../types';

export default function Settings() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SettingsType | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
      setSettings({
        userId: user?.id || '',
        notificationsEnabled: true,
        breakReminders: true,
        hydrationReminders: true,
        workStartTime: '09:00',
        workEndTime: '18:00',
        breakFrequency: 60,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (updates: Partial<SettingsType>) => {
    if (!settings) return;

    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);

    try {
      await settingsService.updateSettings(updates);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Header title="Configurações" />
      <ScrollView style={styles.content}>
        <Card>
          <Text style={styles.sectionTitle}>Perfil</Text>
          <View style={styles.profileInfo}>
            <Text style={styles.profileEmoji}>👤</Text>
            <View style={styles.profileText}>
              <Text style={styles.profileName}>{user?.name}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              <Text style={styles.profileType}>
                Trabalho: {user?.workType === 'remote' ? 'Remoto' : user?.workType === 'hybrid' ? 'Híbrido' : 'Presencial'}
              </Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Notificações</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Notificações gerais</Text>
            <Switch
              value={settings?.notificationsEnabled}
              onValueChange={(value) =>
                handleUpdateSettings({ notificationsEnabled: value })
              }
              trackColor={{ false: COLORS.gray, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Lembretes de pausa</Text>
            <Switch
              value={settings?.breakReminders}
              onValueChange={(value) => handleUpdateSettings({ breakReminders: value })}
              trackColor={{ false: COLORS.gray, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Lembretes de hidratação</Text>
            <Switch
              value={settings?.hydrationReminders}
              onValueChange={(value) => handleUpdateSettings({ hydrationReminders: value })}
              trackColor={{ false: COLORS.gray, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Horário de Trabalho</Text>
          <View style={styles.timeRow}>
            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>Início</Text>
              <Text style={styles.timeValue}>{settings?.workStartTime}</Text>
            </View>
            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>Fim</Text>
              <Text style={styles.timeValue}>{settings?.workEndTime}</Text>
            </View>
          </View>
          <Text style={styles.helpText}>
            As pausas serão sugeridas durante este período
          </Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Frequência de Pausas</Text>
          <Text style={styles.frequencyValue}>A cada {settings?.breakFrequency} minutos</Text>
          <View style={styles.frequencyButtons}>
            {[30, 60, 90, 120].map((freq) => (
              <TouchableOpacity
                key={freq}
                style={[
                  styles.frequencyButton,
                  settings?.breakFrequency === freq && styles.frequencyButtonActive,
                ]}
                onPress={() => handleUpdateSettings({ breakFrequency: freq })}
              >
                <Text
                  style={[
                    styles.frequencyButtonText,
                    settings?.breakFrequency === freq && styles.frequencyButtonTextActive,
                  ]}
                >
                  {freq}min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/about')}
          >
            <Text style={styles.menuItemText}>Sobre o App</Text>
            <Text style={styles.menuItemArrow}>→</Text>
          </TouchableOpacity>
        </Card>

        <Button
          title="Sair da Conta"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
        />

        <Text style={styles.versionText}>Versão 1.0.0</Text>
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
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileEmoji: {
    fontSize: 60,
    marginRight: SPACING.md,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  profileEmail: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
    marginTop: 2,
  },
  profileType: {
    fontSize: SIZES.sm,
    color: COLORS.primary,
    marginTop: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLabel: {
    fontSize: SIZES.md,
    color: COLORS.text,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.sm,
  },
  timeItem: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  timeValue: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  helpText: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  frequencyValue: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  frequencyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    marginHorizontal: 4,
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    alignItems: 'center',
  },
  frequencyButtonActive: {
    backgroundColor: COLORS.primary,
  },
  frequencyButtonText: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
  },
  frequencyButtonTextActive: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  menuItemText: {
    fontSize: SIZES.md,
    color: COLORS.text,
  },
  menuItemArrow: {
    fontSize: SIZES.lg,
    color: COLORS.textLight,
  },
  logoutButton: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  versionText: {
    textAlign: 'center',
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.xl,
  },
});
