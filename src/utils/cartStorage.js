import AsyncStorage from '@react-native-async-storage/async-storage';

import { defaultCartSeed } from '../data/data';
import { buildCartItem } from '../data/nectarData';

const CART_KEY = '@cart_items';

async function seedCart() {
  const seededCart = defaultCartSeed.map((item) => ({
    ...buildCartItem(item.productId),
    quantity: item.quantity,
  }));

  await AsyncStorage.setItem(CART_KEY, JSON.stringify(seededCart));
  return seededCart;
}

export const getCart = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(CART_KEY);

    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }

    return seedCart();
  } catch (e) {
    console.error('Error reading cart data', e);
    return [];
  }
};

export const addToCart = async (item, quantity = 1) => {
  try {
    const cart = await getCart();
    const existingIndex = cart.findIndex((i) => i.id === item.id);
    
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ ...item, quantity });
    }
    
    const jsonValue = JSON.stringify(cart);
    await AsyncStorage.setItem(CART_KEY, jsonValue);
    return cart;
  } catch (e) {
    console.error('Error adding to cart', e);
    return [];
  }
};

export const updateCartItemQuantity = async (id, quantity) => {
  try {
    const cart = await getCart();
    const existingIndex = cart.findIndex((i) => i.id === id);
    
    if (existingIndex > -1) {
      if (quantity <= 0) {
        cart.splice(existingIndex, 1);
      } else {
        cart[existingIndex].quantity = quantity;
      }
      
      const jsonValue = JSON.stringify(cart);
      await AsyncStorage.setItem(CART_KEY, jsonValue);
    }
    return cart;
  } catch (e) {
    console.error('Error updating cart data', e);
    return [];
  }
};

export const clearCart = async () => {
  try {
    await AsyncStorage.setItem(CART_KEY, JSON.stringify([]));
  } catch (e) {
    console.error('Error clearing cart data', e);
  }
};
