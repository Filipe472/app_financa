import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../constants/theme';
import { ensureBoolean } from '../utils/typeHelpers';
import { CATEGORIES } from '../constants/categories';

const FilterBar = ({ filters, onFiltersChange }) => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');

  // Sincronizar inputs quando abre a modal de datas
  const handleOpenDateModal = () => {
    if (filters.startDate && filters.endDate) {
      const [startYear, startMonth, startDay] = filters.startDate.split('-').map(Number);
      const [endYear, endMonth, endDay] = filters.endDate.split('-').map(Number);
      
      setStartDateInput(`${String(startDay).padStart(2, '0')}/${String(startMonth).padStart(2, '0')}/${startYear}`);
      setEndDateInput(`${String(endDay).padStart(2, '0')}/${String(endMonth).padStart(2, '0')}/${endYear}`);
    }
    setShowDateRangeModal(true);
  };

  const handleCategoryChange = (categoryId) => {
    onFiltersChange({
      ...filters,
      category: categoryId,
    });
    setShowCategoryModal(false);
  };

  const handleDateRangeSubmit = () => {
    if (startDateInput.length === 10 && endDateInput.length === 10) {
      const startParts = startDateInput.split('/');
      const endParts = endDateInput.split('/');
      
      const startDate = `${startParts[2]}-${startParts[1]}-${startParts[0]}`;
      const endDate = `${endParts[2]}-${endParts[1]}-${endParts[0]}`;

      onFiltersChange({
        ...filters,
        startDate,
        endDate,
      });
      setShowDateRangeModal(false);
    }
  };

  const formatDateInput = (text) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  };

  const getCategoryLabel = () => {
    if (!filters.category || filters.category === 'all') {
      return 'Todas as categorias';
    }
    return CATEGORIES.find((cat) => cat.id === filters.category)?.label || 'Todas';
  };

  const getDateRangeLabel = () => {
    if (!filters.startDate || !filters.endDate) {
      return 'Selecionar período';
    }
    const [startYear, startMonth, startDay] = filters.startDate.split('-').map(Number);
    const [endYear, endMonth, endDay] = filters.endDate.split('-').map(Number);
    
    const startFormatted = `${String(startDay).padStart(2, '0')}/${String(startMonth).padStart(2, '0')}/${startYear}`;
    const endFormatted = `${String(endDay).padStart(2, '0')}/${String(endMonth).padStart(2, '0')}/${endYear}`;
    
    return `${startFormatted} à ${endFormatted}`;
  };

  const renderCategoryModal = () => (
    <Modal
      visible={ensureBoolean(showCategoryModal)}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCategoryModal(false)}  
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtrar por Categoria</Text>
            <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
              <MaterialIcons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.categoryOption}
            onPress={() => handleCategoryChange('all')}
          >
            <Text
              style={[
                styles.categoryOptionText,
                filters.category === 'all' ? styles.categoryOptionTextActive : null,
              ]}
            >
              Todas as categorias
            </Text>
          </TouchableOpacity>

          <FlatList
            data={CATEGORIES}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryOption}
                onPress={() => handleCategoryChange(item.id)}
              >
                <View style={styles.categoryItemContent}>
                  <View
                    style={[
                      styles.categoryColor,
                      { backgroundColor: item.color },
                    ]}
                  />
                  <Text
                    style={[
                      styles.categoryOptionText,
                      filters.category === item.id ? styles.categoryOptionTextActive : null,
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            scrollEnabled={false}
          />
        </View>
      </View>
    </Modal>
  );

  const renderDateRangeModal = () => (
    <Modal
      visible={ensureBoolean(showDateRangeModal)}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {
        setShowDateRangeModal(false);
        setStartDateInput('');
        setEndDateInput('');
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtrar por Período</Text>
            <TouchableOpacity 
              onPress={() => {
                setShowDateRangeModal(false);
                setStartDateInput('');
                setEndDateInput('');
              }}
            >
              <MaterialIcons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.dateRangeContainer}>
            <View style={styles.dateInputGroup}>
              <TextInput
                style={styles.dateInput}
                placeholder="DD/MM/AAAA"
                placeholderTextColor={COLORS.textMuted}
                value={startDateInput}
                onChangeText={(text) => setStartDateInput(formatDateInput(text))}
                maxLength={10}
              />
            </View>

            <View style={styles.toIndicator} />

            <View style={styles.dateInputGroup}>
              <TextInput
                style={styles.dateInput}
                placeholder="DD/MM/AAAA"
                placeholderTextColor={COLORS.textMuted}
                value={endDateInput}
                onChangeText={(text) => setEndDateInput(formatDateInput(text))}
                maxLength={10}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              (startDateInput.length !== 10 || endDateInput.length !== 10)
                ? styles.primaryButtonDisabled : null,
            ]}
            onPress={handleDateRangeSubmit}
            disabled={ensureBoolean(startDateInput.length !== 10 || endDateInput.length !== 10)}
          >
            <Text style={styles.primaryButtonText}>Aplicar Filtro</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              onFiltersChange({
                ...filters,
                startDate: null,
                endDate: null,
              });
              setShowDateRangeModal(false);
              setStartDateInput('');
              setEndDateInput('');
            }}
          >
            <Text style={styles.secondaryButtonText}>Limpar Filtro</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowCategoryModal(true)}
        >
          <MaterialIcons name="category" size={16} color={COLORS.primary} />
          <Text style={styles.filterButtonText}>{getCategoryLabel()}</Text>
          <MaterialIcons name="expand-more" size={16} color={COLORS.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={handleOpenDateModal}
        >
          <MaterialIcons name="calendar-today" size={16} color={COLORS.primary} />
          <Text style={styles.filterButtonText}>{getDateRangeLabel()}</Text>
          <MaterialIcons name="expand-more" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {renderCategoryModal()}
      {renderDateRangeModal()}
    </>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
  },
  filterButtonText: {
    flex: 1,
    color: COLORS.text,
    fontSize: FONTS.small,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
    paddingBottom: SPACING.xxl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: FONTS.medium,
    fontWeight: '700',
  },
  categoryOption: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoryItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  categoryColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  categoryOptionText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.small,
  },
  categoryOptionTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  dateRangeContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  dateInputGroup: {
    gap: SPACING.xs,
  },
  dateInput: {
    backgroundColor: COLORS.card,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONTS.small,
  },
  toIndicator: {
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  toText: {
    color: COLORS.textMuted,
    fontSize: FONTS.small,
    fontStyle: 'italic',
  },
  primaryButton: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: COLORS.primary + '80',
    opacity: 0.6,
  },
  primaryButtonText: {
    color: COLORS.text,
    fontSize: FONTS.small,
    fontWeight: '700',
  },
  secondaryButton: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.small,
    fontWeight: '700',
  },
});

export default FilterBar;
