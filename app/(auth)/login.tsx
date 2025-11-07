import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useUserStore } from '@/store/useUserStore';
import { generateId, getCurrentDate } from '@/utils/helpers';
import { validateEmail, validatePassword } from '@/utils/validators';
import clsx from 'clsx';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Reset errors
    setErrors({});

    // Validate inputs
    const newErrors: Record<string, string> = {};

    if (isSignUp && !name.trim()) {
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
        name: isSignUp ? name : 'Usuário',
        email,
        createdAt: getCurrentDate(),
        updatedAt: getCurrentDate(),
      };

      setUser(user);
      router.replace('/(app)');
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({
        general: `Erro ao ${isSignUp ? 'criar conta' : 'fazer login'}. Tente novamente.`
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 pt-20 pb-8 bg-background">
          {/* Header */}
          <View className="mb-12">
            <Text className="text-4xl font-bold text-text-primary mb-2">
              {isSignUp ? 'Criar Conta' : 'Bem-vindo de volta!'}
            </Text>
            <Text className="text-lg text-text-secondary">
              {isSignUp
                ? 'Crie sua conta e tenha sua secretária virtual pessoal'
                : 'Entre para acessar sua secretária virtual'}
            </Text>
          </View>

          {/* Form */}
          <View>
            {isSignUp && (
              <Input
                label="Nome"
                value={name}
                onChangeText={setName}
                placeholder="Seu nome completo"
                error={errors.name}
              />
            )}

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
              <Text className="text-danger text-sm mb-4 text-center">
                {errors.general}
              </Text>
            )}

            <Button
              title={isSignUp ? 'Criar Conta' : 'Entrar'}
              onPress={handleSubmit}
              loading={loading}
              className="mt-2"
            />

            {/* Toggle mode */}
            <View className="flex-row justify-center items-center mt-6">
              <Text className="text-text-secondary text-sm">
                {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}
              </Text>
              <TouchableOpacity onPress={toggleMode} disabled={loading}>
                <Text className={clsx(
                  'text-sm font-semibold ml-1',
                  loading ? 'text-text-secondary' : 'text-primary'
                )}>
                  {isSignUp ? 'Entrar' : 'Criar conta'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Demo notice */}
          <View className="mt-auto pt-8">
            <Text className="text-text-secondary text-center text-xs">
              Este é um app de demonstração.{'\n'}
              Para produção, configure o Firebase Authentication.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
