import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from '../screens/HomeScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import InvestmentsScreen from '../screens/InvestmentsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { BankSysColors } from './BankSysColors';

const Tab = createBottomTabNavigator();

export default function MainApp() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Transactions') {
                iconName = focused ? 'list' : 'list-outline';
              } else if (route.name === 'Investments') {
                iconName = focused ? 'trending-up' : 'trending-up-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
              } else {
                iconName = 'home-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: BankSysColors.red,
            tabBarInactiveTintColor: BankSysColors.mediumGray,
            tabBarStyle: {
              backgroundColor: BankSysColors.white,
              borderTopWidth: 1,
              borderTopColor: BankSysColors.lightBorder,
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '500',
            },
            headerStyle: {
              backgroundColor: BankSysColors.red,
            },
            headerTintColor: BankSysColors.white,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
              title: 'Início',
              headerTitle: 'BankSys',
            }}
          />
          <Tab.Screen 
            name="Transactions" 
            component={TransactionsScreen}
            options={{
              title: 'Extrato',
              headerTitle: 'Extrato e Gastos',
            }}
          />
          <Tab.Screen 
            name="Investments" 
            component={InvestmentsScreen}
            options={{
              title: 'Investimentos',
              headerTitle: 'Meus Investimentos',
            }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              title: 'Opções',
              headerTitle: 'Configurações',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BankSysColors.screenBackground,
  },
});