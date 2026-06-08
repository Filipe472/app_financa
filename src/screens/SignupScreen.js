import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants/theme';
import { saveUser } from '../services/storage';
import { showAlert } from '../utils/alert';

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

  const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const handleSignup = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      showAlert('Atencao', 'Por favor, informe seu nome completo.');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      showAlert('Atencao', 'Por favor, informe um e-mail valido.');
      return;
    }

    if (password.length < 6) {
      showAlert('Atencao', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      showAlert('Atencao', 'As senhas informadas nao conferem.');
      return;
    }

    const user = {
      id: Date.now().toString(),
      name: trimmedName,
      email: trimmedEmail,
      password,
      createdAt: new Date().toISOString(),
    };

    const saved = await saveUser(user);

    if (saved) {
      navigation.replace('Login');
    } else {
      showAlert('Erro', 'Nao foi possivel criar sua conta. Tente novamente.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" backgroundColor={COLORS.background} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <MaterialIcons name="savings" size={34} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Cadastre-se para organizar suas financas</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nome completo</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="person-outline"
                size={20}
                color={COLORS.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Seu nome"
                placeholderTextColor={COLORS.textMuted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>E-mail</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="mail-outline"
                size={20}
                color={COLORS.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="email@exemplo.com"
                placeholderTextColor={COLORS.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Senha</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="lock-outline"
                size={20}
                color={COLORS.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Minimo de 6 caracteres"
                placeholderTextColor={COLORS.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={hidePassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setHidePassword(!hidePassword)}
                style={styles.eyeButton}
                activeOpacity={0.7}
              >
                <MaterialIcons
                  name={hidePassword ? 'visibility-off' : 'visibility'}
                  size={20}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirmar senha</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="lock-outline"
                size={20}
                color={COLORS.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Repita sua senha"
                placeholderTextColor={COLORS.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={hideConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setHideConfirmPassword(!hideConfirmPassword)}
                style={styles.eyeButton}
                activeOpacity={0.7}
              >
                <MaterialIcons
                  name={hideConfirmPassword ? 'visibility-off' : 'visibility'}
                  size={20}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSignup}
            activeOpacity={0.8}
          >
            <MaterialIcons name="person-add-alt" size={22} color={COLORS.text} />
            <Text style={styles.primaryButtonText}>Criar conta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.replace('Login')}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>Voltar para login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    ...(Platform.OS === 'web' ? { height: '100vh' } : null),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary + '15',
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    color: COLORS.text,
    fontSize: FONTS.title,
    fontWeight: '800',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONTS.small,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  form: {
    gap: SPACING.md,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  inputGroup: {
    gap: SPACING.sm,
  },
  inputLabel: {
    color: COLORS.textSecondary,
    fontSize: FONTS.small,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  textInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: FONTS.regular,
    paddingVertical: SPACING.md,
  },
  eyeButton: {
    paddingLeft: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md + 2,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.sm,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: COLORS.text,
    fontSize: FONTS.medium,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  secondaryButtonText: {
    color: COLORS.primaryLight,
    fontSize: FONTS.small,
    fontWeight: '700',
  },
});

export default SignupScreen;
