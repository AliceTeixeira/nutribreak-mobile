import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header } from '../../components';
import { COLORS, SPACING, SIZES } from '../../styles';

export default function About() {
  const commitHash = 'COMMIT_HASH_PLACEHOLDER';

  return (
    <View style={styles.container}>
      <Header title="Sobre o App" showBack />
      <ScrollView style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🥗</Text>
          <Text style={styles.appName}>NutriBreak</Text>
          <Text style={styles.version}>Versão 1.0.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <Text style={styles.description}>
            NutriBreak é uma plataforma que usa inteligência artificial para ajudar profissionais a
            manterem uma rotina de trabalho mais saudável, equilibrada e produtiva.
          </Text>
          <Text style={styles.description}>
            Com base no humor, nível de energia, tipo de jornada (remota, híbrida ou presencial) e
            tempo de tela, a IA recomenda pausas e cardápios personalizados para melhorar foco,
            bem-estar e desempenho.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Objetivos</Text>
          <Text style={styles.description}>
            Promover saúde física e mental no trabalho através de pausas inteligentes e sugestões
            de alimentação equilibrada, aproveitando o poder da IA para personalizar a rotina de
            cada pessoa.
          </Text>
          <Text style={styles.odsText}>
            🎯 Alinhado aos ODS 3 (Saúde e bem-estar) e ODS 8 (Trabalho decente e crescimento
            econômico).
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Funcionalidades</Text>
          <Text style={styles.featureItem}>✓ Cadastro personalizado de usuário</Text>
          <Text style={styles.featureItem}>✓ Registro diário de humor e energia</Text>
          <Text style={styles.featureItem}>✓ Recomendações personalizadas por IA</Text>
          <Text style={styles.featureItem}>✓ Lembretes inteligentes de pausas</Text>
          <Text style={styles.featureItem}>✓ Histórico de bem-estar</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Técnicas</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Plataforma:</Text>
            <Text style={styles.infoValue}>React Native</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Framework:</Text>
            <Text style={styles.infoValue}>Expo</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Navegação:</Text>
            <Text style={styles.infoValue}>Expo Router</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hash do Commit:</Text>
            <Text style={styles.commitHash}>{commitHash}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Desenvolvido por</Text>
          <Text style={styles.description}>
            Global Solution - FIAP 2024
          </Text>
          <Text style={styles.description}>
            Mobile Application Development
          </Text>
        </View>

        <Text style={styles.copyright}>
          © 2024 NutriBreak. Todos os direitos reservados.
        </Text>
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
    padding: SPACING.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logo: {
    fontSize: 100,
    marginBottom: SPACING.md,
  },
  appName: {
    fontSize: SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  version: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: SIZES.md,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: SPACING.sm,
  },
  odsText: {
    fontSize: SIZES.md,
    color: COLORS.primary,
    fontWeight: '500',
    marginTop: SPACING.sm,
  },
  featureItem: {
    fontSize: SIZES.md,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    paddingLeft: SPACING.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  commitHash: {
    fontSize: SIZES.sm,
    color: COLORS.primary,
    fontFamily: 'monospace',
  },
  copyright: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
});
