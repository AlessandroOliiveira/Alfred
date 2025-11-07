import { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useUserStore } from '@/store/useUserStore';
import { validateEmail, validatePassword } from '@/utils/validators';
import { generateId, getCurrentDate } from '@/utils/helpers';

export default function LoginScreen() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validate inputs
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!validateEmail(email)) {
      newErrors.email = 'Email inválido';
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // For demo purposes, just create a user
      // In production, use Firebase Authentication
      const user = {
        id: generateId(),
        name,
        email,
        createdAt: getCurrentDate(),
        updatedAt: getCurrentDate(),
      };

      setUser(user);
      router.replace('/(app)');
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Erro ao fazer login. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-background">
        <View className="flex-1 px-6 pt-20">
          <Text className="text-4xl font-bold text-text-primary mb-2">
            Bem-vindo!
          </Text>
          <Text className="text-lg text-text-secondary mb-8">
            Sua secretária virtual pessoal
          </Text>

          <Input
            label="Nome"
            value={name}
            onChangeText={setName}
            placeholder="Seu nome"
            error={errors.name}
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            keyboardType="email-address"
            error={errors.email}
          />

          <Input
            label="Senha"
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            error={errors.password}
          />

          {errors.general && (
            <Text className="text-danger text-sm mb-4">{errors.general}</Text>
          )}

          <Button
            title="Entrar"
            onPress={handleLogin}
            loading={loading}
            className="mt-4"
          />

          <Text className="text-text-secondary text-center mt-6 text-sm">
            Este é um app de demonstração.{'\n'}
            Para produção, configure o Firebase Authentication.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
