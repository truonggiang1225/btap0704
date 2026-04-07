import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { getImageSource, nectarTheme } from '../data/nectarData';

export default function CategoryCard({ item, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.card,
        {
          backgroundColor: item.backgroundColor,
          borderColor: item.borderColor,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.imageWrap}>
        <Image source={getImageSource(item.imageKey)} style={styles.image} resizeMode="contain" />
      </View>

      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  imageWrap: {
    width: 120,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: nectarTheme.text,
    textAlign: 'center',
  },
});
