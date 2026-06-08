import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants/theme';
import { CATEGORIES } from '../constants/categories';
import { addExpense } from '../services/storage';
import { showAlert } from '../utils/alert';

const AddExpenseScreen = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Inicializar com data local sem conversão de fuso horário
  const getLocalDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [date, setDate] = useState(getLocalDate());
  const [dateInput, setDateInput] = useState(new Date().toLocaleDateString('pt-BR'));

  const handleSave = async () => {
    // Validações
    if (!description.trim()) {
      showAlert('Atenção', 'Por favor, informe a descrição da despesa.');
      return;
    }

    const parsedAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showAlert('Atenção', 'Por favor, informe um valor válido.');
      return;
    }

    if (!selectedCategory) {
      showAlert('Atenção', 'Por favor, selecione uma categoria.');
      return;
    }

    const expense = {
      description: description.trim(),
      amount: parsedAmount,
      category: selectedCategory,
      date: date,
    };

    const result = await addExpense(expense);

    if (result) {
      navigation.goBack();
    } else {
      showAlert('Erro', 'Não foi possível salvar a despesa. Tente novamente.');
    }
  };

  const formatDateInput = (text) => {
    // Remove tudo que não é número
    const numbers = text.replace(/\D/g, '');

    // Formata como DD/MM/AAAA
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  };

  const handleDateChange = (text) => {
    const formatted = formatDateInput(text);
    setDateInput(formatted);

    // Converter para ISO quando completo
    if (formatted.length === 10) {
      const parts = formatted.split('/');
      const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      setDate(isoDate);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova Despesa</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
      >
        {/* Campo Valor */}
        <View style={styles.amountSection}>
          <Text style={styles.currencySymbol}>R$</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0,00"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* Campo Descrição */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Descrição</Text>
          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="description"
              size={20}
              color={COLORS.textMuted}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Ex: Almoço no restaurante"
              placeholderTextColor={COLORS.textMuted}
              value={description}
              onChangeText={setDescription}
              maxLength={100}
            />
          </View>
        </View>

        {/* Campo Data */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Data</Text>
          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="calendar-today"
              size={20}
              color={COLORS.textMuted}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={COLORS.textMuted}
              value={dateInput}
              onChangeText={handleDateChange}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>
        </View>

        {/* Categorias */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Categoria</Text>
          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === cat.id ? {
                    borderColor: cat.color,
                    backgroundColor: cat.color + '15',
                  } : null,
                ]}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.categoryIconContainer,
                    {
                      backgroundColor:
                        selectedCategory === cat.id
                          ? cat.color + '30'
                          : COLORS.surfaceLight,
                    },
                  ]}
                >
                  <MaterialIcons
                    name={cat.icon}
                    size={22}
                    color={selectedCategory === cat.id ? cat.color : COLORS.textMuted}
                  />
                </View>
                <Text
                  style={[
                    styles.categoryLabel,
                    selectedCategory === cat.id ? { color: cat.color } : null,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <MaterialIcons name="check" size={22} color={COLORS.text} />
          <Text style={styles.saveButtonText}>Salvar Despesa</Text>
        </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xxl + SPACING.md,
    paddingBottom: SPACING.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: FONTS.large,
    fontWeight: '700',
  },
  placeholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  amountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
    marginBottom: SPACING.md,
  },
  currencySymbol: {
    color: COLORS.textSecondary,
    fontSize: FONTS.xlarge,
    fontWeight: '600',
    marginRight: SPACING.sm,
  },
  amountInput: {
    color: COLORS.text,
    fontSize: 48,
    fontWeight: '800',
    minWidth: 120,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    color: COLORS.textSecondary,
    fontSize: FONTS.small,
    fontWeight: '600',
    marginBottom: SPACING.sm,
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
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  categoryButton: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  categoryIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  categoryLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md + 2,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.md,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: COLORS.text,
    fontSize: FONTS.medium,
    fontWeight: '700',
  },
});

export default AddExpenseScreen;
