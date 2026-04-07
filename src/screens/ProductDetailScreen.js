import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';

import { buildCartItem, getImageSource, getProductDetail, nectarTheme } from '../data/nectarData';
import { addToCart } from '../utils/cartStorage';
import { isFavoriteProduct, toggleFavorite } from '../utils/favoriteStorage';

function QuantitySelector({ quantity, onDecrease, onIncrease }) {
  return (
    <View style={styles.quantityRow}>
      <TouchableOpacity activeOpacity={0.85} onPress={onDecrease}>
        <Ionicons name="remove" size={26} color="#B3B3B3" />
      </TouchableOpacity>

      <View style={styles.quantityValueWrap}>
        <Text style={styles.quantityValue}>{quantity}</Text>
      </View>

      <TouchableOpacity activeOpacity={0.85} onPress={onIncrease}>
        <Ionicons name="add" size={26} color={nectarTheme.green} />
      </TouchableOpacity>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

export default function ProductDetailScreen({ navigation, route }) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const product = useMemo(() => getProductDetail(route.params?.productId), [route.params?.productId]);

  useFocusEffect(
    useCallback(() => {
      const loadFavoriteState = async () => {
        setIsFavorite(await isFavoriteProduct(product.id));
      };

      loadFavoriteState();
    }, [product.id])
  );

  const handleAddToBasket = async () => {
    await addToCart(buildCartItem(product.id), quantity);
    setQuantity(1);
    navigation.getParent()?.navigate('CartTab');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${product.name} - ${product.subtitle} - $${product.price.toFixed(2)}`,
      });
    } catch (_error) {
      Alert.alert('Cannot share right now', 'Please try again in a moment.');
    }
  };

  const handleToggleFavorite = async () => {
    const nextFavorites = await toggleFavorite(product.id);
    setIsFavorite(nextFavorites.includes(product.id));
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        <View style={styles.heroBlock}>
          <View style={styles.heroHeader}>
            <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={28} color={nectarTheme.text} />
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.85} onPress={handleShare}>
              <Ionicons name="share-social-outline" size={23} color={nectarTheme.text} />
            </TouchableOpacity>
          </View>

          <Image source={getImageSource(product.imageKey)} style={styles.heroImage} resizeMode="contain" />

          <View style={styles.heroIndicators}>
            <View style={[styles.heroDot, styles.heroDotActive]} />
            <View style={styles.heroDot} />
            <View style={styles.heroDot} />
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.title}>{product.name}</Text>
              <Text style={styles.subtitle}>{product.subtitle}</Text>
            </View>

            <TouchableOpacity activeOpacity={0.85} onPress={handleToggleFavorite}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={28}
                color={isFavorite ? '#F3603F' : '#7C7C7C'}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.priceRow}>
            <QuantitySelector
              quantity={quantity}
              onDecrease={() => setQuantity((current) => Math.max(1, current - 1))}
              onIncrease={() => setQuantity((current) => current + 1)}
            />

            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          </View>

          <Divider />

          <View style={styles.rowHeader}>
            <Text style={styles.rowTitle}>Product Detail</Text>
            <Ionicons name="chevron-down" size={22} color={nectarTheme.text} />
          </View>

          <Text style={styles.description}>{product.description}</Text>

          <Divider />

          <View style={styles.rowHeader}>
            <Text style={styles.rowTitle}>Nutritions</Text>

            <View style={styles.rowRight}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{product.nutrition}</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={nectarTheme.text} />
            </View>
          </View>

          <Divider />

          <View style={styles.rowHeader}>
            <Text style={styles.rowTitle}>Review</Text>

            <View style={styles.rowRight}>
              <View style={styles.starRow}>
                {Array.from({ length: product.reviewRating }).map((_, index) => (
                  <Ionicons key={`${product.id}-star-${index}`} name="star" size={18} color="#F3603F" />
                ))}
              </View>
              <Ionicons name="chevron-forward" size={22} color={nectarTheme.text} />
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.addButton}
            onPress={handleAddToBasket}
          >
            <Text style={styles.addButtonText}>Add To Basket</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: nectarTheme.background,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  heroBlock: {
    backgroundColor: '#F2F3F2',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 22,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  heroImage: {
    width: '100%',
    height: 250,
  },
  heroIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  heroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D5D5D5',
    marginHorizontal: 3,
  },
  heroDotActive: {
    width: 16,
    backgroundColor: nectarTheme.green,
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    color: nectarTheme.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 16,
    lineHeight: 20,
    color: nectarTheme.mutedText,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  quantityRow: {
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
    marginHorizontal: 18,
  },
  quantityValue: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
    color: nectarTheme.text,
  },
  price: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
    color: nectarTheme.text,
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginTop: 28,
  },
  rowHeader: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
    color: nectarTheme.text,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: nectarTheme.mutedText,
    marginTop: 4,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  badge: {
    minWidth: 54,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#EBEBEB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginRight: 10,
  },
  badgeText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    color: nectarTheme.mutedText,
  },
  addButton: {
    marginTop: 28,
    height: 66,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: nectarTheme.green,
  },
  addButtonText: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
