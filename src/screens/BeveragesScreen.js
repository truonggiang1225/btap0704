import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import ProductCard from '../components/ProductCard';
import { beverages, nectarTheme } from '../data/nectarData';
import { addToCart } from '../utils/cartStorage';

export default function BeveragesScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const cardWidth = (width - 56) / 2;

  const handleAdd = async (item) => {
    await addToCart(
      {
        id: item.id,
        name: item.name.replace('\n', ' '),
        subtitle: item.subtitle,
        price: item.price,
        imageKey: item.imageKey,
      },
      1
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color={nectarTheme.text} />
          </TouchableOpacity>

          <Text style={styles.title}>Beverages</Text>

          <TouchableOpacity activeOpacity={0.85}>
            <Ionicons name="options-outline" size={24} color={nectarTheme.text} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={beverages}
          numColumns={2}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              width={cardWidth}
              imageHeight={104}
              cardStyle={styles.card}
              onAdd={() => handleAdd(item)}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: nectarTheme.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '600',
    color: nectarTheme.text,
  },
  column: {
    justifyContent: 'space-between',
  },
  listContent: {
    paddingBottom: 120,
  },
  card: {
    marginBottom: 16,
  },
});
