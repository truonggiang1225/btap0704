import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { getImageSource, nectarTheme } from '../data/nectarData';

export default function ProductCard({
  item,
  width = 174,
  imageHeight = 88,
  cardStyle,
  onPress,
  onAdd,
}) {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.88 : 1}
      onPress={onPress}
      style={[styles.card, { width }, cardStyle]}
    >
      <View style={[styles.imageWrap, { height: imageHeight }]}>
        <Image
          source={getImageSource(item.imageKey)}
          resizeMode="contain"
          style={styles.image}
        />
      </View>

      <Text numberOfLines={2} style={styles.name}>
        {item.name}
      </Text>
      <Text numberOfLines={2} style={styles.subtitle}>
        {item.subtitle}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.addButton}
          onPress={(event) => {
            event.stopPropagation?.();
            onAdd?.();
          }}
        >
          <Ionicons name="add" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: nectarTheme.border,
    backgroundColor: nectarTheme.surface,
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 14,
  },
  imageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '600',
    color: nectarTheme.text,
    minHeight: 40,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 18,
    color: nectarTheme.mutedText,
    marginTop: 4,
    minHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  price: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
    color: nectarTheme.text,
  },
  addButton: {
    width: 46,
    height: 46,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: nectarTheme.green,
  },
});
