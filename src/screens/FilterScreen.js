import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { filterBrandOptions, filterCategoryOptions } from '../data/data';
import { nectarTheme } from '../data/nectarData';

function normalizeFilters(filters) {
  return {
    categories: Array.isArray(filters?.categories) ? filters.categories : [],
    brands: Array.isArray(filters?.brands) ? filters.brands : [],
  };
}

function FilterOption({ label, selected, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.88} style={styles.optionRow} onPress={onPress}>
      <View style={[styles.checkbox, selected ? styles.checkboxSelected : null]}>
        {selected ? <Ionicons name="checkmark" size={13} color="#FFFFFF" /> : null}
      </View>
      <Text style={[styles.optionLabel, selected ? styles.optionLabelSelected : null]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function FilterScreen({ navigation, route }) {
  const [selectedFilters, setSelectedFilters] = useState(() =>
    normalizeFilters(route.params?.appliedFilters)
  );

  const selectedCount = useMemo(
    () => selectedFilters.categories.length + selectedFilters.brands.length,
    [selectedFilters]
  );

  const toggleGroupValue = (group, value) => {
    setSelectedFilters((current) => {
      const currentValues = current[group];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      return {
        ...current,
        [group]: nextValues,
      };
    });
  };

  const handleApply = () => {
    navigation.navigate({
      name: 'Search',
      params: { appliedFilters: selectedFilters },
      merge: true,
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={nectarTheme.text} />
        </TouchableOpacity>

        <Text style={styles.title}>Filters</Text>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.sheet}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>

            {filterCategoryOptions.map((option) => (
              <FilterOption
                key={option}
                label={option}
                selected={selectedFilters.categories.includes(option)}
                onPress={() => toggleGroupValue('categories', option)}
              />
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Brand</Text>

            {filterBrandOptions.map((option) => (
              <FilterOption
                key={option}
                label={option}
                selected={selectedFilters.brands.includes(option)}
                onPress={() => toggleGroupValue('brands', option)}
              />
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity activeOpacity={0.9} style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyText}>
            Apply Filter{selectedCount > 0 ? ` (${selectedCount})` : ''}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: nectarTheme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 16,
  },
  headerSpacer: {
    width: 24,
  },
  title: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '600',
    color: nectarTheme.text,
  },
  sheet: {
    flex: 1,
    backgroundColor: '#F2F3F2',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 26,
    paddingBottom: 24,
  },
  sheetContent: {
    paddingBottom: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '600',
    color: nectarTheme.text,
    marginBottom: 18,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#B1B1B1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: nectarTheme.green,
    borderColor: nectarTheme.green,
  },
  optionLabel: {
    marginLeft: 12,
    fontSize: 16,
    lineHeight: 20,
    color: nectarTheme.text,
  },
  optionLabelSelected: {
    color: nectarTheme.green,
  },
  applyButton: {
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: nectarTheme.green,
  },
  applyText: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
