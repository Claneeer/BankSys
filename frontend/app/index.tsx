import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useAppStore } from '../src/controllers/AppStore';
import LoginScreen from '../src/views/screens/LoginScreen';
import MainApp from '../src/views/components/MainApp';
import { BankSysColors } from '../src/views/components/BankSysColors';

// Simple test login component
function TestLogin() {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAppStore();

  const handleTestLogin = async () => {
    console.log('🔐 Test login called');
    if (!cpf || !password) {
      Alert.alert('Erro', 'Preencha CPF e senha');
      return;
    }

    try {
      setLoading(true);
      console.log('🔐 Calling login with:', cpf);
      await login(cpf, password);
      console.log('✅ Login successful!');
    } catch (error: any) {
      console.error('❌ Login error:', error);
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.testContainer}>
      <Text style={styles.testTitle}>BankSys Test Login</Text>
      
      <TextInput
        style={styles.testInput}
        placeholder="CPF (ex: 12345678900)"
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
      />
      
      <TextInput
        style={styles.testInput}
        placeholder="Senha (ex: teste123)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity 
        style={styles.testButton} 
        onPress={handleTestLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.testButtonText}>Login</Text>
        )}
      </TouchableOpacity>
      
      <Text style={styles.testInfo}>Demo: CPF: 12345678900, Senha: teste123</Text>
    </View>
  );
}

export default function Index() {
  const { 
    isAuthenticated, 
    authLoading, 
    initializeAuth 
  } = useAppStore();
  
  const [useTestLogin, setUseTestLogin] = useState(true); // Toggle for testing

  useEffect(() => {
    initializeAuth();
  }, []);

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={BankSysColors.red} />
        <Text>Carregando BankSys...</Text>
      </View>
    );
  }

  // Show main app if authenticated
  if (isAuthenticated) {
    return <MainApp />;
  }

  // Show test login or regular login screen
  if (useTestLogin) {
    return (
      <View style={styles.container}>
        <TestLogin />
        <TouchableOpacity 
          style={styles.switchButton}
          onPress={() => setUseTestLogin(false)}
        >
          <Text style={styles.switchText}>Use Fancy Login Screen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LoginScreen />
      <TouchableOpacity 
        style={styles.switchButton}
        onPress={() => setUseTestLogin(true)}
      >
        <Text style={styles.switchText}>Use Test Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BankSysColors.screenBackground,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BankSysColors.screenBackground,
  },
  testContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: BankSysColors.white,
  },
  testTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BankSysColors.red,
    marginBottom: 30,
  },
  testInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: BankSysColors.lightBorder,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  testButton: {
    width: '100%',
    height: 50,
    backgroundColor: BankSysColors.red,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  testButtonText: {
    color: BankSysColors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  testInfo: {
    fontSize: 14,
    color: BankSysColors.mediumGray,
    textAlign: 'center',
  },
  switchButton: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    height: 40,
    backgroundColor: BankSysColors.yellow,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchText: {
    color: BankSysColors.black,
    fontWeight: 'bold',
  },
});