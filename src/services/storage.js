import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@financas_app_expenses';
const USER_STORAGE_KEY = '@financas_app_user';

// Carregar usuario cadastrado no AsyncStorage
export const loadUser = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Erro ao carregar usuario:', error);
    return null;
  }
};

// Salvar usuario cadastrado no AsyncStorage
export const saveUser = async (user) => {
  try {
    const jsonValue = JSON.stringify(user);
    await AsyncStorage.setItem(USER_STORAGE_KEY, jsonValue);
    return true;
  } catch (error) {
    console.error('Erro ao salvar usuario:', error);
    return false;
  }
};

// Carregar todos os gastos do AsyncStorage
export const loadExpenses = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Erro ao carregar gastos:', error);
    return [];
  }
};

// Salvar todos os gastos no AsyncStorage
export const saveExpenses = async (expenses) => {
  try {
    const jsonValue = JSON.stringify(expenses);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    return true;
  } catch (error) {
    console.error('Erro ao salvar gastos:', error);
    return false;
  }
};

// Adicionar um novo gasto
export const addExpense = async (expense) => {
  try {
    const expenses = await loadExpenses();
    const newExpense = {
      ...expense,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    expenses.push(newExpense);
    await saveExpenses(expenses);
    return newExpense;
  } catch (error) {
    console.error('Erro ao adicionar gasto:', error);
    return null;
  }
};

// Excluir um gasto
export const deleteExpense = async (expenseId) => {
  try {
    const expenses = await loadExpenses();
    const filtered = expenses.filter((e) => e.id !== expenseId);
    await saveExpenses(filtered);
    return true;
  } catch (error) {
    console.error('Erro ao excluir gasto:', error);
    return false;
  }
};

// Calcular total de gastos
export const getTotalExpenses = (expenses) => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

// Agrupar gastos por categoria
export const getExpensesByCategory = (expenses) => {
  const grouped = {};
  expenses.forEach((expense) => {
    if (!grouped[expense.category]) {
      grouped[expense.category] = {
        total: 0,
        count: 0,
        expenses: [],
      };
    }
    grouped[expense.category].total += expense.amount;
    grouped[expense.category].count += 1;
    grouped[expense.category].expenses.push(expense);
  });
  return grouped;
};

// Filtrar gastos do mês atual
export const getCurrentMonthExpenses = (expenses) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return expenses.filter((expense) => {
    const expenseDate = new Date(expense.date || expense.createdAt);
    return (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  });
};

// Filtrar gastos por intervalo de datas
export const filterExpensesByDateRange = (expenses, startDate, endDate) => {
  // Parse das datas no formato ISO (YYYY-MM-DD)
  const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
  const [endYear, endMonth, endDay] = endDate.split('-').map(Number);

  return expenses.filter((expense) => {
    const dateStr = expense.date || expense.createdAt;
    let expYear, expMonth, expDay;

    // Se for formato ISO YYYY-MM-DD, faz parse manual
    if (dateStr.includes('-') && !dateStr.includes('T')) {
      [expYear, expMonth, expDay] = dateStr.split('-').map(Number);
    } else {
      // Se for timestamp, converte normalmente
      const expenseDate = new Date(dateStr);
      expYear = expenseDate.getFullYear();
      expMonth = expenseDate.getMonth() + 1;
      expDay = expenseDate.getDate();
    }

    // Comparar como YYYYMMDD para evitar problemas com fuso horário
    const expDateNum = expYear * 10000 + expMonth * 100 + expDay;
    const startDateNum = startYear * 10000 + startMonth * 100 + startDay;
    const endDateNum = endYear * 10000 + endMonth * 100 + endDay;

    return expDateNum >= startDateNum && expDateNum <= endDateNum;
  });
};

// Filtro unificado que combina categoria e intervalo de datas
export const filterExpenses = (expenses, filters = {}) => {
  let filtered = [...expenses];

  // Aplicar filtro de categoria se fornecido
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter((expense) => expense.category === filters.category);
  }

  // Aplicar filtro de intervalo de datas se fornecido
  if (filters.startDate && filters.endDate) {
    filtered = filterExpensesByDateRange(filtered, filters.startDate, filters.endDate);
  }

  return filtered;
};
