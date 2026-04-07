import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { getImageSource, getProductDetail, nectarTheme } from '../data/nectarData';
import { addToCart } from '../utils/cartStorage';
import { getFavorites } from '../utils/favoriteStorage';

function FavoriteRow({ item, onOpen }) {
  return (
    <TouchableOpacity activeOpacity={0.88} style={styles.row} onPress={onOpen}>
      <Image source={getImageSource(item.thumbnailKey)} style={styles.image} resizeMode="contain" />

      <View style={styles.meta}>
        <Text style={styles.name}>{item.cartName}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>

      <View style={styles.trailing}>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        <Ionicons name="chevron-forward" size={18} color={nectarTheme.text} />
      </View>
    </TouchableOpacity>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconWrap}>
        <Ionicons name="heart-outline" size={34} color={nectarTheme.green} />
      </View>
      <Text style={styles.emptyTitle}>No favourites yet</Text>
      <Text style={styles.emptyText}>Tap the heart on a product detail screen to save it here.</Text>
    </View>
  );
}

function AddAllButton({ onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.addButton} onPress={onPress}>
      <Text style={styles.addButtonText}>Add All To Cart</Text>
    </TouchableOpacity>
  );
}

export default function FavouriteScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const tabBarHeight = useBottomTabBarHeight();

  const loadFavorites = useCallback(async () => {
    const favoriteIds = await getFavorites();
    setFavorites(favoriteIds.map((id) => getProductDetail(id)));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const handleAddAllToCart = async () => {
    await Promise.all(
      favorites.map((item) =>
        addToCart(
          {
            id: item.id,
            name: item.cartName,
            subtitle: item.subtitle,
            price: item.price,
            imageKey: item.thumbnailKey,
          },
          1
        )
      )
    );

    Alert.alert('Added to cart', 'All favourite products have been added to your cart.');
    navigation.navigate('CartTab');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      <View style={styles.container}>
        <Text style={styles.title}>Favourite</Text>

        {favorites.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <FlatList
              data={favorites}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[styles.listContent, { paddingBottom: tabBarHeight + 88 }]}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item }) => (
                <FavoriteRow
                  item={item}
                  onOpen={() =>
                    navigation.navigate('ShopTab', {
                      screen: 'ProductDetail',
                      params: { productId: item.id },
                    })
                  }
                />
              )}
            />

            <View style={[styles.addButtonWrap, { bottom: tabBarHeight + 8 }]}>
              <AddAllButton onPress={handleAddAllToCart} />
            </View>
          </>
        )}
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
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '600',
    color: nectarTheme.text,
    textAlign: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 146,
  },
  separator: {
    height: 1,
    backgroundColor: '#EDEDED',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
  },
  image: {
    width: 44,
    height: 64,
    marginRight: 16,
  },
  meta: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    color: nectarTheme.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 18,
    color: nectarTheme.mutedText,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    color: nectarTheme.text,
    marginRight: 8,
  },
  addButtonWrap: {
    position: 'absolute',
    left: 20,
    right: 20,
  },
  addButton: {
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: nectarTheme.green,
  },
  addButtonText: {
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  emptyIconWrap: {
    width: 74,
    height: 74,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF8F2',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '600',
    color: nectarTheme.text,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 22,
    color: nectarTheme.mutedText,
    textAlign: 'center',
    maxWidth: 270,
  },
});
