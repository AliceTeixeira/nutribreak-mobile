import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../core/providers';
import { Button, Input } from '../../components';
import { COLORS, SPACING, SIZES, RADIUS } from '../../styles';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const { signIn } = useAuth();
  const router = useRouter();

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace('/(tabs)/dashboard');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>🥗</Text>
          <Text style={styles.title}>NutriBreak</Text>
          <Text style={styles.subtitle}>Bem-vindo de volta!</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <Input
            label="Senha"
            placeholder="Sua senha"
            value={password}
            onChangeText={setPassword}
            isPassword
            error={errors.password}
          />

          <Button title="Entrar" onPress={handleLogin} loading={loading} style={styles.button} />

          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.signupText}>
              Não tem uma conta? <Text style={styles.signupLink}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logo: {
    fontSize: 80,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
  },
  form: {
    width: '100%',
  },
  button: {
    marginTop: SPACING.md,
  },
  signupText: {
    textAlign: 'center',
    marginTop: SPACING.lg,
    fontSize: SIZES.md,
    color: COLORS.textLight,
  },
  signupLink: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
