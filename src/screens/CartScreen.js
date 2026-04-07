import React, { useCallback, useMemo, useState } from 'react';
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

import { getImageSource, nectarTheme } from '../data/nectarData';
import { clearCart, getCart, updateCartItemQuantity } from '../utils/cartStorage';

function QuantityControl({ quantity, onDecrease, onIncrease }) {
  return (
    <View style={styles.quantityControl}>
      <TouchableOpacity activeOpacity={0.85} onPress={onDecrease}>
        <Ionicons name="remove" size={20} color="#B3B3B3" />
      </TouchableOpacity>

      <View style={styles.quantityValueWrap}>
        <Text style={styles.quantityValue}>{quantity}</Text>
      </View>

      <TouchableOpacity activeOpacity={0.85} onPress={onIncrease}>
        <Ionicons name="add" size={20} color={nectarTheme.green} />
      </TouchableOpacity>
    </View>
  );
}

function CartItem({ item, onDecrease, onIncrease, onRemove }) {
  return (
    <View style={styles.itemRow}>
      <Image source={getImageSource(item.imageKey)} style={styles.itemImage} resizeMode="contain" />

      <View style={styles.itemContent}>
        <View style={styles.itemHead}>
          <View style={styles.itemMeta}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
          </View>

          <TouchableOpacity activeOpacity={0.85} onPress={onRemove}>
            <Ionicons name="close" size={18} color="#B3B3B3" />
          </TouchableOpacity>
        </View>

        <View style={styles.itemFoot}>
          <QuantityControl quantity={item.quantity} onDecrease={onDecrease} onIncrease={onIncrease} />
          <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
}

function EmptyCart({ navigation }) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconWrap}>
        <Ionicons name="cart-outline" size={34} color={nectarTheme.green} />
      </View>
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptyText}>Add products from Shop, Search, or Favourites to see them here.</Text>
      <TouchableOpacity
        activeOpacity={0.88}
        style={styles.emptyButton}
        onPress={() => navigation.navigate('ExploreTab')}
      >
        <Text style={styles.emptyButtonText}>Start shopping</Text>
      </TouchableOpacity>
    </View>
  );
}

function CheckoutButton({ total, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.checkoutButton} onPress={onPress}>
      <Text style={styles.checkoutText}>Go to Checkout</Text>

      <View style={styles.checkoutBadge}>
        <Text style={styles.checkoutBadgeText}>${total.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function CartScreen({ navigation }) {
  const [cartItems, setCartItems] = useState([]);
  const tabBarHeight = useBottomTabBarHeight();

  const loadCart = useCallback(async () => {
    const items = await getCart();
    setCartItems(items);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [loadCart])
  );

  const handleQuantityChange = async (id, nextQuantity) => {
    const updated = await updateCartItemQuantity(id, nextQuantity);
    setCartItems(updated);
  };

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const handleCheckout = async () => {
    await clearCart();
    setCartItems([]);
    Alert.alert('Order placed', 'Your cart has been checked out successfully.');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      <View style={styles.container}>
        <Text style={styles.title}>My Cart</Text>

        {cartItems.length === 0 ? (
          <EmptyCart navigation={navigation} />
        ) : (
          <>
            <FlatList
              data={cartItems}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[styles.listContent, { paddingBottom: tabBarHeight + 88 }]}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item }) => (
                <CartItem
                  item={item}
                  onDecrease={() => handleQuantityChange(item.id, item.quantity - 1)}
                  onIncrease={() => handleQuantityChange(item.id, item.quantity + 1)}
                  onRemove={() => handleQuantityChange(item.id, 0)}
                />
              )}
            />

            <View style={[styles.checkoutWrap, { bottom: tabBarHeight + 8 }]}>
              <CheckoutButton total={total} onPress={handleCheckout} />
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
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
  },
  itemImage: {
    width: 72,
    height: 72,
    marginRight: 18,
  },
  itemContent: {
    flex: 1,
  },
  itemHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  itemMeta: {
    flex: 1,
    paddingRight: 10,
  },
  itemName: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    color: nectarTheme.text,
  },
  itemSubtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 18,
    color: nectarTheme.mutedText,
  },
  itemFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemPrice: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
    color: nectarTheme.text,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityValueWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: nectarTheme.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 14,
  },
  quantityValue: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
    color: nectarTheme.text,
  },
  checkoutWrap: {
    position: 'absolute',
    left: 20,
    right: 20,
  },
  checkoutButton: {
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: nectarTheme.green,
  },
  checkoutText: {
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  checkoutBadge: {
    position: 'absolute',
    right: 14,
    minWidth: 46,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    backgroundColor: 'rgba(72, 158, 105, 0.95)',
  },
  checkoutBadgeText: {
    fontSize: 11,
    lineHeight: 13,
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
    maxWidth: 280,
  },
  emptyButton: {
    marginTop: 24,
    height: 58,
    minWidth: 180,
    paddingHorizontal: 26,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: nectarTheme.green,
  },
  emptyButtonText: {
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
