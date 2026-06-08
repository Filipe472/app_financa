import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants/theme';
import { getCategoryById } from '../constants/categories';
import { getExpensesByCategory } from '../services/storage';

const screenWidth = Dimensions.get('window').width;

const ExpenseChart = ({ expenses }) => {
  const grouped = getExpensesByCategory(expenses);
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (expenses.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Adicione gastos para ver o gráfico</Text>
      </View>
    );
  }

  const chartData = Object.keys(grouped)
    .map((categoryId) => {
      const category = getCategoryById(categoryId);
      return {
        name: category.label,
        amount: grouped[categoryId].total,
        color: category.color,
        legendFontColor: COLORS.textSecondary,
        legendFontSize: 12,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gastos por Categoria</Text>
      <View style={styles.chartWrapper}>
        <PieChart
          data={chartData}
          width={screenWidth - SPACING.md * 2}
          height={200}
          chartConfig={{
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft={10}
          absolute={false}
          hasLegend={true}
        />
      </View>
      <View style={styles.detailsList}>
        {chartData.map((item) => {
          const percentage = ((item.amount / total) * 100).toFixed(1);
          const formattedAmount = item.amount.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          });
          return (
            <View key={item.name} style={styles.detailItem}>
              <View style={styles.detailLeft}>
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                <Text style={styles.detailName}>{item.name}</Text>
              </View>
              <View style={styles.detailRight}>
                <Text style={styles.detailAmount}>{formattedAmount}</Text>
                <Text style={styles.detailPercent}>{percentage}%</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    color: COLORS.text,
    fontSize: FONTS.medium,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  chartWrapper: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  emptyContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: FONTS.regular,
  },
  detailsList: {
    gap: SPACING.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  detailName: {
    color: COLORS.textSecondary,
    fontSize: FONTS.small,
  },
  detailRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  detailAmount: {
    color: COLORS.text,
    fontSize: FONTS.small,
    fontWeight: '600',
  },
  detailPercent: {
    color: COLORS.textMuted,
    fontSize: FONTS.small,
    minWidth: 45,
    textAlign: 'right',
  },
});

export default ExpenseChart;
