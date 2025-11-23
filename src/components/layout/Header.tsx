import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES, SPACING } from '../../styles';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightButton?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, showBack = false, rightButton }) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.rightContainer}>{rightButton}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primary,
  },
  leftContainer: {
    width: 40,
  },
  rightContainer: {
    width: 40,
  },
  backButton: {
    padding: SPACING.xs,
  },
  backText: {
    fontSize: SIZES.xl,
    color: COLORS.white,
  },
  title: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.white,
    flex: 1,
    textAlign: 'center',
  },
});
