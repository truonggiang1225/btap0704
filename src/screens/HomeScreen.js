import React, { useMemo, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import ProductCard from '../components/ProductCard';
import SectionHeader from '../components/SectionHeader';
import {
  bannerContent,
  bestSellingProducts,
  featuredProducts,
  getImageSource,
  groceryHighlights,
  groceryProducts,
  nectarTheme,
} from '../data/nectarData';
import { addToCart } from '../utils/cartStorage';

function LogoMark() {
  return (
    <View style={styles.logoWrap}>
      <View style={styles.logoLeafLeft} />
      <View style={styles.logoLeafRight} />
      <View style={styles.logoBody} />
    </View>
  );
}

function SearchBar({ value, onChangeText }) {
  return (
    <View style={styles.searchBar}>
      <Ionicons name="search-outline" size={22} color="#7C7C7C" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search Store"
        placeholderTextColor="#7C7C7C"
        style={styles.searchInput}
      />
    </View>
  );
}

function BannerCard() {
  return (
    <View style={styles.bannerCard}>
      <View style={styles.bannerGlowLeft} />
      <View style={styles.bannerGlowRight} />

      <Image
        source={getImageSource(bannerContent.heroImageKey)}
        style={styles.bannerHero}
        resizeMode="contain"
      />
      <Image
        source={getImageSource(bannerContent.decorImageKey)}
        style={styles.bannerDecor}
        resizeMode="contain"
      />

      <View style={styles.bannerTextWrap}>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.88}
          style={styles.bannerTitle}
        >
          {bannerContent.title}
        </Text>
        <Text style={styles.bannerSubtitle}>{bannerContent.subtitle}</Text>
      </View>

      <View style={styles.bannerIndicators}>
        <View style={[styles.bannerDot, styles.bannerDotActive]} />
        <View style={styles.bannerDot} />
        <View style={styles.bannerDot} />
      </View>
    </View>
  );
}

function GroceryHighlightCard({ item }) {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[styles.highlightCard, { backgroundColor: item.backgroundColor }]}
    >
      <Image source={getImageSource(item.imageKey)} style={styles.highlightImage} resizeMode="contain" />
      <Text style={styles.highlightLabel}>{item.name}</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();

  const filteredFeaturedProducts = useMemo(() => {
    if (!normalizedQuery) {
      return featuredProducts;
    }

    return featuredProducts.filter(
      (item) =>
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.subtitle.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  const filteredBestSellingProducts = useMemo(() => {
    if (!normalizedQuery) {
      return bestSellingProducts;
    }

    return bestSellingProducts.filter(
      (item) =>
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.subtitle.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  const filteredGroceryProducts = useMemo(() => {
    if (!normalizedQuery) {
      return groceryProducts;
    }

    return groceryProducts.filter(
      (item) =>
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.subtitle.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  const filteredHighlights = useMemo(() => {
    if (!normalizedQuery) {
      return groceryHighlights;
    }

    return groceryHighlights.filter((item) => item.name.toLowerCase().includes(normalizedQuery));
  }, [normalizedQuery]);

  const hasResults =
    filteredFeaturedProducts.length > 0 ||
    filteredBestSellingProducts.length > 0 ||
    filteredGroceryProducts.length > 0 ||
    filteredHighlights.length > 0;

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <LogoMark />
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={18} color="#4C4F4D" />
            <View style={styles.locationSpacer} />
            <Text style={styles.locationText}>Dhaka, Banassre</Text>
          </View>
        </View>

        <SearchBar value={query} onChangeText={setQuery} />
        <BannerCard />

        {filteredFeaturedProducts.length > 0 ? (
          <View style={styles.section}>
            <SectionHeader
              title="Exclusive Offer"
              onPress={() => navigation.getParent()?.navigate('ExploreTab')}
            />

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {filteredFeaturedProducts.map((item, index) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  width={172}
                  imageHeight={78}
                  onAdd={() => handleAdd(item)}
                  onPress={
                    item.opensDetail
                      ? () => navigation.navigate('ProductDetail', { productId: item.id })
                      : undefined
                  }
                  cardStyle={index === filteredFeaturedProducts.length - 1 ? null : styles.trailingCard}
                />
              ))}
            </ScrollView>
          </View>
        ) : null}

        {filteredBestSellingProducts.length > 0 ? (
          <View style={styles.section}>
            <SectionHeader
              title="Best Selling"
              onPress={() => navigation.getParent()?.navigate('ExploreTab')}
            />

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {filteredBestSellingProducts.map((item, index) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  width={172}
                  imageHeight={78}
                  onAdd={() => handleAdd(item)}
                  cardStyle={index === filteredBestSellingProducts.length - 1 ? null : styles.trailingCard}
                />
              ))}
            </ScrollView>
          </View>
        ) : null}

        {filteredHighlights.length > 0 || filteredGroceryProducts.length > 0 ? (
          <View style={styles.section}>
            <SectionHeader
              title="Groceries"
              onPress={() => navigation.getParent()?.navigate('ExploreTab')}
            />

            {filteredHighlights.length > 0 ? (
              <View style={styles.highlightRow}>
                {filteredHighlights.map((item) => (
                  <GroceryHighlightCard key={item.id} item={item} />
                ))}
              </View>
            ) : null}

            {filteredGroceryProducts.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {filteredGroceryProducts.map((item, index) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    width={172}
                    imageHeight={78}
                    onAdd={() => handleAdd(item)}
                    cardStyle={index === filteredGroceryProducts.length - 1 ? null : styles.trailingCard}
                  />
                ))}
              </ScrollView>
            ) : null}
          </View>
        ) : null}

        {normalizedQuery && !hasResults ? (
          <Text style={styles.emptyText}>No products match your search.</Text>
        ) : null}
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
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 14,
  },
  logoWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoBody: {
    width: 12,
    height: 18,
    borderRadius: 8,
    backgroundColor: '#F08A4B',
    transform: [{ rotate: '32deg' }],
  },
  logoLeafLeft: {
    position: 'absolute',
    top: 1,
    left: 7,
    width: 7,
    height: 10,
    borderRadius: 7,
    backgroundColor: '#53B175',
    transform: [{ rotate: '-28deg' }],
  },
  logoLeafRight: {
    position: 'absolute',
    top: 1,
    right: 7,
    width: 7,
    height: 10,
    borderRadius: 7,
    backgroundColor: '#53B175',
    transform: [{ rotate: '28deg' }],
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationSpacer: {
    width: 4,
  },
  locationText: {
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '600',
    color: '#4C4F4D',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: nectarTheme.input,
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: nectarTheme.text,
  },
  bannerCard: {
    height: 116,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#EEF7F1',
    justifyContent: 'center',
    marginBottom: 22,
  },
  bannerGlowLeft: {
    position: 'absolute',
    left: -20,
    top: 18,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#DDF1E5',
  },
  bannerGlowRight: {
    position: 'absolute',
    right: -18,
    top: -26,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F6ED',
  },
  bannerHero: {
    position: 'absolute',
    left: 6,
    bottom: 2,
    width: 128,
    height: 96,
  },
  bannerDecor: {
    position: 'absolute',
    right: 8,
    top: 10,
    width: 86,
    height: 32,
    opacity: 0.95,
  },
  bannerTextWrap: {
    position: 'absolute',
    left: 130,
    right: 18,
    top: 22,
    alignItems: 'flex-start',
  },
  bannerTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
    color: nectarTheme.text,
    width: '100%',
  },
  bannerSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: nectarTheme.green,
    marginTop: 2,
  },
  bannerIndicators: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C9C9C9',
    marginHorizontal: 3,
  },
  bannerDotActive: {
    width: 16,
    backgroundColor: nectarTheme.green,
  },
  section: {
    marginBottom: 22,
  },
  trailingCard: {
    marginRight: 14,
  },
  highlightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  highlightCard: {
    width: '48%',
    minHeight: 92,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightImage: {
    width: 56,
    height: 56,
    marginRight: 8,
  },
  highlightLabel: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    color: nectarTheme.text,
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 21,
    color: nectarTheme.mutedText,
    textAlign: 'center',
    marginTop: 4,
  },
});
