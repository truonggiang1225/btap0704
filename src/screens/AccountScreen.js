import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { nectarTheme } from '../data/nectarData';

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color={nectarTheme.green} />
      </View>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || '-'}</Text>
      </View>
    </View>
  );
}

export default function AccountScreen({ session, onLogout }) {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      <View style={styles.container}>
        <View style={styles.headerIcon}>
          <Ionicons name="person-outline" size={34} color={nectarTheme.green} />
        </View>

        <Text style={styles.title}>Account</Text>
        <Text style={styles.subtitle}>Your basic profile and imported auth session are connected now.</Text>

        <View style={styles.card}>
          <InfoRow icon="mail-outline" label="Email" value={session?.email} />
          <InfoRow icon="location-outline" label="Zone" value={session?.zone} />
          <InfoRow icon="map-outline" label="Area" value={session?.area} />
        </View>

        <TouchableOpacity activeOpacity={0.88} style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 120,
  },
  headerIcon: {
    width: 74,
    height: 74,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF8F2',
    alignSelf: 'center',
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
    marginBottom: 26,
  },
  card: {
    borderRadius: 22,
    backgroundColor: '#F7F8F7',
    padding: 18,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: nectarTheme.mutedText,
  },
  infoValue: {
    marginTop: 2,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '600',
    color: nectarTheme.text,
  },
  logoutButton: {
    marginTop: 24,
    height: 58,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: nectarTheme.green,
  },
  logoutText: {
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
