import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants/theme';
import { getCategoryById } from '../constants/categories';

const ExpenseCard = ({ expense, onDelete }) => {
  const category = getCategoryById(expense.category);
  
  // Parse manual da data ISO para evitar problema de fuso horário
  const getFormattedDate = () => {
    const dateStr = expense.date || expense.createdAt;
    if (!dateStr) return '';
    
    if (dateStr.includes('-') && !dateStr.includes('T')) {
      // Formato ISO YYYY-MM-DD
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('pt-BR');
    } else {
      // Formato com timestamp
      return new Date(dateStr).toLocaleDateString('pt-BR');
    }
  };
  
  const formattedDate = getFormattedDate();
  const formattedAmount = expense.amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <View style={styles.card}>
      <View style={[styles.categoryIndicator, { backgroundColor: category.color }]} />
      <View style={styles.iconContainer}>
        <View style={[styles.iconCircle, { backgroundColor: category.color + '20' }]}>
          <MaterialIcons name={category.icon} size={24} color={category.color} />
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.description} numberOfLines={1}>
          {expense.description}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.category}>{category.label}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.amount}>{formattedAmount}</Text>
        <TouchableOpacity
          onPress={() => onDelete(expense.id)}
          style={styles.deleteButton}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="delete-outline" size={20} color={COLORS.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    padding: SPACING.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderBottomLeftRadius: BORDER_RADIUS.lg,
  },
  iconContainer: {
    marginRight: SPACING.md,
    marginLeft: SPACING.xs,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  description: {
    color: COLORS.text,
    fontSize: FONTS.regular,
    fontWeight: '600',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  category: {
    color: COLORS.textSecondary,
    fontSize: FONTS.small,
  },
  date: {
    color: COLORS.textMuted,
    fontSize: FONTS.small,
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: SPACING.xs,
  },
  amount: {
    color: COLORS.danger,
    fontSize: FONTS.regular,
    fontWeight: '700',
  },
  deleteButton: {
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
});

export default ExpenseCard;
