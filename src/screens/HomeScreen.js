import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { showAlert } from '../utils/alert';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants/theme';
import { loadExpenses, deleteExpense, getTotalExpenses, getExpensesByCategory, filterExpenses } from '../services/storage';
import { getCategoryById } from '../constants/categories';
import ExpenseCard from '../components/ExpenseCard';
import SummaryCard from '../components/SummaryCard';
import ExpenseChart from '../components/ExpenseChart';
import FilterBar from '../components/FilterBar';

const HomeScreen = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);
  const [showChart, setShowChart] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    startDate: null,
    endDate: null,
  });

  const fetchExpenses = useCallback(async () => {
    const data = await loadExpenses();
    // Ordenar por data mais recente
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setExpenses(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [fetchExpenses])
  );

  const handleDelete = (expenseId) => {
    showAlert(
      'Excluir Despesa',
      'Tem certeza que deseja excluir esta despesa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deleteExpense(expenseId);
            await fetchExpenses();
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    navigation.replace('Login');
  };

  // Aplicar filtros aos expenses
  const filteredExpenses = filterExpenses(expenses, filters);

  const total = getTotalExpenses(filteredExpenses);
  const grouped = getExpensesByCategory(filteredExpenses);
  const topCategoryId = Object.keys(grouped).sort(
    (a, b) => grouped[b].total - grouped[a].total
  )[0];
  const topCategory = topCategoryId ? getCategoryById(topCategoryId).label : null;

  const renderHeader = () => (
    <View>
      <SummaryCard
        totalExpenses={total}
        expenseCount={filteredExpenses.length}
        topCategory={topCategory}
      />

      <FilterBar filters={filters} onFiltersChange={setFilters} />

      <View style={styles.chartToggle}>
        <TouchableOpacity
          onPress={() => setShowChart(!showChart)}
          style={styles.toggleButton}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name={showChart ? 'pie-chart' : 'pie-chart-outline'}
            size={20}
            color={COLORS.primary}
          />
          <Text style={styles.toggleText}>
            {showChart ? 'Ocultar Gráfico' : 'Mostrar Gráfico'}
          </Text>
        </TouchableOpacity>
      </View>

      {showChart && <ExpenseChart expenses={filteredExpenses} />}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Despesas Recentes</Text>
        <Text style={styles.sectionCount}>{filteredExpenses.length}</Text>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="receipt-long" size={64} color={COLORS.textMuted} />
      <Text style={styles.emptyTitle}>Nenhuma despesa registrada</Text>
      <Text style={styles.emptySubtitle}>
        Toque no botão "+" para adicionar sua primeira despesa
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>FM Finanças</Text>
          <Text style={styles.subtitle}>Gerencie suas despesas</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <MaterialIcons name="logout" size={22} color={COLORS.danger} />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.list}
        data={filteredExpenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExpenseCard expense={item} onDelete={handleDelete} />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={true}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddExpense')}
        activeOpacity={0.8}
      >
        <MaterialIcons name="add" size={30} color={COLORS.text} />
      </TouchableOpacity>
    </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl + SPACING.md,
    paddingBottom: SPACING.md,
  },
  greeting: {
    color: COLORS.text,
    fontSize: FONTS.title,
    fontWeight: '800',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONTS.small,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.danger + '15',
    borderWidth: 1,
    borderColor: COLORS.danger + '30',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  logoutText: {
    color: COLORS.danger,
    fontSize: FONTS.small,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 100,
  },
  list: {
    flex: 1,
  },
  chartToggle: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    alignSelf: 'flex-end',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.primary + '15',
    borderRadius: BORDER_RADIUS.full,
  },
  toggleText: {
    color: COLORS.primary,
    fontSize: FONTS.small,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: FONTS.medium,
    fontWeight: '700',
  },
  sectionCount: {
    color: COLORS.textMuted,
    fontSize: FONTS.small,
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: SPACING.xxl,
    marginTop: SPACING.xl,
  },
  emptyTitle: {
    color: COLORS.textSecondary,
    fontSize: FONTS.medium,
    fontWeight: '600',
    marginTop: SPACING.md,
  },
  emptySubtitle: {
    color: COLORS.textMuted,
    fontSize: FONTS.small,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default HomeScreen;
