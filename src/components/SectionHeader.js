import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { nectarTheme } from '../data/nectarData';

export default function SectionHeader({ title, actionLabel = 'See all', onPress }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <Text style={styles.action}>{actionLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600',
    color: nectarTheme.text,
  },
  action: {
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '600',
    color: nectarTheme.green,
  },
});
