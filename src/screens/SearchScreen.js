import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import ProductCard from '../components/ProductCard';
import { searchProducts } from '../data/data';
import { buildCartItem, nectarTheme } from '../data/nectarData';
import { addToCart } from '../utils/cartStorage';

function normalizeFilters(filters) {
  return {
    categories: Array.isArray(filters?.categories) ? filters.categories : [],
    brands: Array.isArray(filters?.brands) ? filters.brands : [],
  };
}

function SearchBar({ query, onChangeQuery, activeFilterCount, onOpenFilters }) {
  return (
    <View style={styles.searchRow}>
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color="#7C7C7C" />
        <TextInput
          autoFocus
          value={query}
          onChangeText={onChangeQuery}
          placeholder="Search Store"
          placeholderTextColor="#7C7C7C"
          style={styles.searchInput}
        />
      </View>

      <TouchableOpacity activeOpacity={0.88} style={styles.filterButton} onPress={onOpenFilters}>
        <Ionicons name="options-outline" size={18} color={nectarTheme.text} />

        {activeFilterCount > 0 ? (
          <View style={styles.filterBadge}>
            <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
          </View>
        ) : null}
      </TouchableOpacity>
    </View>
  );
}

export default function SearchScreen({ navigation, route }) {
  const { width } = useWindowDimensions();
  const cardWidth = (width - 54) / 2;
  const [query, setQuery] = useState(route.params?.query ?? '');
  const [selectedFilters, setSelectedFilters] = useState(() =>
    normalizeFilters(route.params?.appliedFilters)
  );

  useEffect(() => {
    if (typeof route.params?.query === 'string') {
      setQuery(route.params.query);
    }
  }, [route.params?.query]);

  useEffect(() => {
    if (route.params?.appliedFilters) {
      setSelectedFilters(normalizeFilters(route.params.appliedFilters));
    }
  }, [route.params?.appliedFilters]);

  const products = useMemo(() => searchProducts(query, selectedFilters), [query, selectedFilters]);
  const activeFilterCount =
    selectedFilters.categories.length + selectedFilters.brands.length;

  const handleAdd = async (productId) => {
    await addToCart(buildCartItem(productId), 1);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={
          <View>
            <SearchBar
              query={query}
              onChangeQuery={setQuery}
              activeFilterCount={activeFilterCount}
              onOpenFilters={() =>
                navigation.navigate('Filter', {
                  appliedFilters: selectedFilters,
                })
              }
            />

            {activeFilterCount > 0 ? (
              <Text style={styles.filterSummary}>
                {selectedFilters.categories.concat(selectedFilters.brands).join(' • ')}
              </Text>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No matching products</Text>
            <Text style={styles.emptyText}>Try a different search term or update your filters.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            width={cardWidth}
            imageHeight={76}
            cardStyle={styles.card}
            onAdd={() => handleAdd(item.id)}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: nectarTheme.background,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 120,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 16,
    backgroundColor: nectarTheme.input,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: nectarTheme.text,
  },
  filterButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F7F6',
    marginLeft: 12,
  },
  filterBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: nectarTheme.green,
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  filterSummary: {
    fontSize: 13,
    lineHeight: 18,
    color: nectarTheme.green,
    marginBottom: 16,
  },
  column: {
    justifyContent: 'space-between',
  },
  card: {
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 42,
  },
  emptyTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
    color: nectarTheme.text,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: nectarTheme.mutedText,
    textAlign: 'center',
    maxWidth: 240,
  },
});
