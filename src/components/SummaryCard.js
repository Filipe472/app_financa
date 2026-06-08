import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants/theme';
const SummaryCard = ({ totalExpenses, expenseCount, topCategory }) => {
  const formattedTotal = totalExpenses.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <View style={styles.container}>
      <View style={styles.gradientCard}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.label}>Total de Gastos</Text>
            <Text style={styles.totalAmount}>{formattedTotal}</Text>
          </View>
          <View style={styles.iconBadge}>
            <MaterialIcons name="account-balance-wallet" size={28} color={COLORS.primary} />
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialIcons name="receipt-long" size={16} color={COLORS.textSecondary} />
            <Text style={styles.statText}>
              {expenseCount} {expenseCount === 1 ? 'despesa' : 'despesas'}
            </Text>
          </View>
          {topCategory && (
            <View style={styles.statItem}>
              <MaterialIcons name="trending-up" size={16} color={COLORS.warning} />
              <Text style={styles.statText}>Maior: {topCategory}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  gradientCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONTS.small,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  totalAmount: {
    color: COLORS.text,
    fontSize: FONTS.xlarge,
    fontWeight: '800',
  },
  iconBadge: {
    backgroundColor: COLORS.primary + '15',
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.small,
  },
});

export default SummaryCard;
