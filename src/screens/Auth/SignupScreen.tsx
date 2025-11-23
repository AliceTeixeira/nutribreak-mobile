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
import { COLORS, SPACING, SIZES } from '../../styles';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [workType, setWorkType] = useState('remote');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { signUp } = useAuth();
  const router = useRouter();

  const validateForm = () => {
    const newErrors = { name: '', email: '', password: '', confirmPassword: '' };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
      isValid = false;
    }

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

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signUp(
        name.trim(),
        email.trim(),
        password,
        workType,
        [],
        ['Melhorar bem-estar', 'Aumentar produtividade']
      );
      router.replace('/(tabs)/dashboard');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao criar conta. Tente novamente.');
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
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Comece sua jornada de bem-estar!</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Nome Completo"
            placeholder="Seu nome"
            value={name}
            onChangeText={setName}
            error={errors.name}
          />

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
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={setPassword}
            isPassword
            error={errors.password}
          />

          <Input
            label="Confirmar Senha"
            placeholder="Digite a senha novamente"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPassword
            error={errors.confirmPassword}
          />

          <Text style={styles.label}>Tipo de Trabalho</Text>
          <View style={styles.workTypeContainer}>
            {[
              { value: 'remote', label: 'Remoto' },
              { value: 'hybrid', label: 'Híbrido' },
              { value: 'onsite', label: 'Presencial' },
            ].map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.workTypeButton,
                  workType === type.value && styles.workTypeButtonActive,
                ]}
                onPress={() => setWorkType(type.value)}
              >
                <Text
                  style={[
                    styles.workTypeText,
                    workType === type.value && styles.workTypeTextActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Button
            title="Criar Conta"
            onPress={handleSignup}
            loading={loading}
            style={styles.button}
          />

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.loginText}>
              Já tem uma conta? <Text style={styles.loginLink}>Faça login</Text>
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
  label: {
    fontSize: SIZES.sm,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    fontWeight: '500',
  },
  workTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  workTypeButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    alignItems: 'center',
  },
  workTypeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  workTypeText: {
    color: COLORS.textLight,
    fontSize: SIZES.sm,
  },
  workTypeTextActive: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  button: {
    marginTop: SPACING.md,
  },
  loginText: {
    textAlign: 'center',
    marginTop: SPACING.lg,
    fontSize: SIZES.md,
    color: COLORS.textLight,
  },
  loginLink: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
