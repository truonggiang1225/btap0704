import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { addToCart } from '../utils/cartStorage';

const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 812;

const SCAN_BACKGROUND = require('../../assets/images/scan-bottle-bg.png');
const SCAN_FRAME = require('../../assets/images/scan-frame.png');
const SCAN_BAND = require('../../assets/images/scan-band.png');
const SCAN_CARD = require('../../assets/images/scan-card.png');

const FRAME_RECT = { x: 50, y: 151, width: 275, height: 497 };
const BAND_RECT = { x: 44.5, y: 388, width: 286, height: 259 };
const CARD_RECT = { x: 0, y: 574, width: 375, height: 238 };
const ADD_BUTTON_HIT = { x: 271, y: 696, width: 46, height: 46 };
const BACK_BUTTON_RECT = { x: 25, y: 57, width: 46, height: 46 };

export default function ScanScreen() {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();

  const scale = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
  const canvasWidth = DESIGN_WIDTH * scale;
  const canvasHeight = DESIGN_HEIGHT * scale;
  const offsetX = (width - canvasWidth) / 2;
  const offsetY = (height - canvasHeight) / 2;

  const handleAddToCart = async () => {
    const item = {
      id: 'juice_01',
      name: 'Orange Juice',
      brand: "Lauren's",
      price: 149,
      image: 'juice-thumb',
    };

    await addToCart(item);
    navigation.navigate('MainTabs', { screen: 'CartTab' });
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />

      <View
        style={[
          styles.canvas,
          {
            width: canvasWidth,
            height: canvasHeight,
            left: offsetX,
            top: offsetY,
          },
        ]}
      >
        <Image source={SCAN_BACKGROUND} style={styles.backgroundImage} resizeMode="stretch" />

        <Image
          source={SCAN_FRAME}
          style={[
            styles.overlay,
            {
              left: FRAME_RECT.x * scale,
              top: FRAME_RECT.y * scale,
              width: FRAME_RECT.width * scale,
              height: FRAME_RECT.height * scale,
            },
          ]}
          resizeMode="stretch"
        />

        <Image
          source={SCAN_BAND}
          style={[
            styles.overlay,
            {
              left: BAND_RECT.x * scale,
              top: BAND_RECT.y * scale,
              width: BAND_RECT.width * scale,
              height: BAND_RECT.height * scale,
            },
          ]}
          resizeMode="stretch"
        />

        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.backButton,
            {
              left: BACK_BUTTON_RECT.x * scale,
              top: BACK_BUTTON_RECT.y * scale,
              width: BACK_BUTTON_RECT.width * scale,
              height: BACK_BUTTON_RECT.height * scale,
              borderRadius: 13 * scale,
            },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24 * scale} color="#6674ff" />
        </TouchableOpacity>

        <Image
          source={SCAN_CARD}
          style={[
            styles.overlay,
            {
              left: CARD_RECT.x * scale,
              top: CARD_RECT.y * scale,
              width: CARD_RECT.width * scale,
              height: CARD_RECT.height * scale,
            },
          ]}
          resizeMode="stretch"
        />

        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.9}
          onPress={handleAddToCart}
          style={[
            styles.addButtonHit,
            {
              left: ADD_BUTTON_HIT.x * scale,
              top: ADD_BUTTON_HIT.y * scale,
              width: ADD_BUTTON_HIT.width * scale,
              height: ADD_BUTTON_HIT.height * scale,
              borderRadius: 14 * scale,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ede1cf',
  },
  canvas: {
    position: 'absolute',
    overflow: 'hidden',
    backgroundColor: '#ede1cf',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  overlay: {
    position: 'absolute',
  },
  backButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    shadowColor: '#8f7d68',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  addButtonHit: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
});
