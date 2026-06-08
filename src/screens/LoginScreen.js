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
import { loadUser } from '../services/storage';
import { showAlert } from '../utils/alert';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  const handleLogin = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      showAlert('Atencao', 'Informe seu e-mail e senha para entrar.');
      return;
    }

    const user = await loadUser();

    if (!user) {
      showAlert('Conta nao encontrada', 'Crie uma conta antes de entrar no aplicativo.');
      return;
    }

    if (user.email !== trimmedEmail || user.password !== password) {
      showAlert('Dados invalidos', 'E-mail ou senha incorretos.');
      return;
    }

    navigation.replace('Home');
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
        <View style={styles.hero}>
          <View style={styles.logoRow}>
            <View style={styles.logoBadge}>
              <MaterialIcons name="savings" size={34} color={COLORS.primaryLight} />
            </View>
            <View>
              <Text style={styles.brandName}>FM Financas</Text>
              <Text style={styles.brandTagline}>Controle financeiro pessoal</Text>
            </View>
          </View>

          <Text style={styles.title}>Entre na sua conta</Text>
          <Text style={styles.subtitle}>
            Acompanhe despesas, categorias e seu resumo financeiro em um so lugar.
          </Text>

        </View>

        <View style={styles.form}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Login</Text>
            <Text style={styles.formSubtitle}>Informe seus dados para continuar</Text>
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
                placeholder="Sua senha"
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

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <MaterialIcons name="login" size={22} color={COLORS.text} />
            <Text style={styles.primaryButtonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Signup')}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>Nao tenho conta. Criar cadastro</Text>
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
  hero: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary + '20',
    borderWidth: 1,
    borderColor: COLORS.primary + '55',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  brandName: {
    color: COLORS.text,
    fontSize: FONTS.large,
    fontWeight: '900',
  },
  brandTagline: {
    color: COLORS.primaryLight,
    fontSize: FONTS.small,
    fontWeight: '600',
    marginTop: 2,
  },
  title: {
    color: COLORS.text,
    fontSize: FONTS.xlarge,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONTS.regular,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 22,
    maxWidth: 460,
  },
  form: {
    gap: SPACING.md,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary + '35',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  formHeader: {
    marginBottom: SPACING.xs,
  },
  formTitle: {
    color: COLORS.text,
    fontSize: FONTS.medium,
    fontWeight: '800',
  },
  formSubtitle: {
    color: COLORS.textMuted,
    fontSize: FONTS.small,
    marginTop: 2,
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
    backgroundColor: COLORS.card,
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

export default LoginScreen;
