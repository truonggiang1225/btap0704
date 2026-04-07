import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import CategoryCard from '../components/CategoryCard';
import { categories, nectarTheme } from '../data/nectarData';

function SearchLauncher({ onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.searchBar} onPress={onPress}>
      <Ionicons name="search-outline" size={22} color="#7C7C7C" />
      <Text style={styles.searchPlaceholder}>Search Store</Text>
    </TouchableOpacity>
  );
}

export default function ExploreScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <Text style={styles.title}>Find Products</Text>
        <SearchLauncher onPress={() => navigation.navigate('Search')} />

        <View style={styles.grid}>
          {categories.map((item) => (
            <CategoryCard
              key={item.id}
              item={item}
              onPress={
                item.routeName
                  ? () => navigation.navigate(item.routeName)
                  : () => Alert.alert('Coming soon', 'This category will be completed next.')
              }
            />
          ))}
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: nectarTheme.background,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 120,
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '600',
    color: nectarTheme.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: nectarTheme.input,
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 20,
  },
  searchPlaceholder: {
    marginLeft: 10,
    fontSize: 15,
    color: '#7C7C7C',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  spacer: {
    height: 24,
  },
});
