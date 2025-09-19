import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useAppStore } from '../src/controllers/AppStore';
import LoginScreen from '../src/views/screens/LoginScreen';
import MainApp from '../src/views/components/MainApp';
import { BankSysColors } from '../src/views/components/BankSysColors';

export default function Index() {
  const { 
    isAuthenticated, 
    authLoading, 
    initializeAuth 
  } = useAppStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={BankSysColors.red} />
      </View>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Show main app if authenticated
  return <MainApp />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BankSysColors.screenBackground,
  },
});