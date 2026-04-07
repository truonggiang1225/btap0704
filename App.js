import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import AccountScreen from './src/screens/AccountScreen';
import AuthFlowScreen from './src/screens/AuthFlowScreen';
import CartScreen from './src/screens/CartScreen';
import BeveragesScreen from './src/screens/BeveragesScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import FavouriteScreen from './src/screens/FavouriteScreen';
import FilterScreen from './src/screens/FilterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import SearchScreen from './src/screens/SearchScreen';
import { nectarTheme } from './src/data/nectarData';
import { clearAuthSession, getAuthSession, persistAuthSession } from './src/utils/authStorage';

const Tab = createBottomTabNavigator();
const ShopStack = createNativeStackNavigator();
const ExploreStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

function ShopStackNavigator() {
  return (
    <ShopStack.Navigator screenOptions={{ headerShown: false }}>
      <ShopStack.Screen name="Home" component={HomeScreen} />
      <ShopStack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </ShopStack.Navigator>
  );
}

function ExploreStackNavigator() {
  return (
    <ExploreStack.Navigator screenOptions={{ headerShown: false }}>
      <ExploreStack.Screen name="Explore" component={ExploreScreen} />
      <ExploreStack.Screen name="Search" component={SearchScreen} />
      <ExploreStack.Screen name="Filter" component={FilterScreen} />
      <ExploreStack.Screen name="Beverages" component={BeveragesScreen} />
      <ExploreStack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </ExploreStack.Navigator>
  );
}

function getTabBarStyle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? '';

  if (routeName === 'ProductDetail' || routeName === 'Filter') {
    return styles.hiddenTabBar;
  }

  return styles.tabBar;
}

function renderTabIcon(routeName, color, focused) {
  if (routeName === 'ShopTab') {
    return <Ionicons name={focused ? 'storefront' : 'storefront-outline'} size={24} color={color} />;
  }

  if (routeName === 'ExploreTab') {
    return <Ionicons name={focused ? 'search' : 'search-outline'} size={24} color={color} />;
  }

  if (routeName === 'CartTab') {
    return <Ionicons name={focused ? 'cart' : 'cart-outline'} size={24} color={color} />;
  }

  if (routeName === 'FavouriteTab') {
    return <Ionicons name={focused ? 'heart' : 'heart-outline'} size={24} color={color} />;
  }

  return <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />;
}

function MainTabs({ session, onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: true,
        tabBarActiveTintColor: nectarTheme.green,
        tabBarInactiveTintColor: '#7C7C7C',
        tabBarStyle: getTabBarStyle(route),
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        tabBarIcon: ({ color, focused }) => renderTabIcon(route.name, color, focused),
      })}
    >
      <Tab.Screen
        name="ShopTab"
        component={ShopStackNavigator}
        options={{ tabBarLabel: 'Shop' }}
      />
      <Tab.Screen
        name="ExploreTab"
        component={ExploreStackNavigator}
        options={{ tabBarLabel: 'Explore' }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{ tabBarLabel: 'Cart' }}
      />
      <Tab.Screen
        name="FavouriteTab"
        component={FavouriteScreen}
        options={{ tabBarLabel: 'Favourite' }}
      />
      <Tab.Screen name="AccountTab" options={{ tabBarLabel: 'Account' }}>
        {() => <AccountScreen session={session} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      const currentSession = await getAuthSession();
      setSession(currentSession);
      setIsReady(true);
    };

    loadSession();
  }, []);

  const handleAuthenticated = async (sessionData) => {
    const nextSession = await persistAuthSession(sessionData);
    setSession(nextSession);
  };

  const handleLogout = async () => {
    await clearAuthSession();
    setSession(null);
  };

  if (!isReady) {
    return <View style={styles.loadingScreen} />;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {session?.isAuthenticated ? (
          <RootStack.Screen name="Main">
            {() => <MainTabs session={session} onLogout={handleLogout} />}
          </RootStack.Screen>
        ) : (
          <RootStack.Screen name="Auth">
            {() => <AuthFlowScreen onAuthenticated={handleAuthenticated} />}
          </RootStack.Screen>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabBar: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 10,
    height: 74,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    paddingTop: 8,
    paddingBottom: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 8,
  },
  hiddenTabBar: {
    display: 'none',
  },
  tabBarItem: {
    paddingVertical: 4,
  },
  tabBarLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
});
