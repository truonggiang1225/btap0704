import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { nectarTheme } from '../data/nectarData';

export default function InfoScreen({ title, subtitle, iconName = 'apps-outline' }) {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <Ionicons name={iconName} size={34} color={nectarTheme.green} />
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconWrap: {
    width: 74,
    height: 74,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF8F2',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '600',
    color: nectarTheme.text,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 22,
    color: nectarTheme.mutedText,
    textAlign: 'center',
  },
});
