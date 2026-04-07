import AsyncStorage from '@react-native-async-storage/async-storage';

import { defaultFavoriteIds } from '../data/data';

const FAVORITES_KEY = '@favorite_product_ids';

export const getFavorites = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);

    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }

    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(defaultFavoriteIds));
    return defaultFavoriteIds;
  } catch (error) {
    console.error('Error reading favorite products', error);
    return [];
  }
};

export const toggleFavorite = async (productId) => {
  try {
    const currentFavorites = await getFavorites();
    const exists = currentFavorites.includes(productId);

    const nextFavorites = exists
      ? currentFavorites.filter((id) => id !== productId)
      : [...currentFavorites, productId];

    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavorites));
    return nextFavorites;
  } catch (error) {
    console.error('Error updating favorite products', error);
    return [];
  }
};

export const isFavoriteProduct = async (productId) => {
  const favorites = await getFavorites();
  return favorites.includes(productId);
};
