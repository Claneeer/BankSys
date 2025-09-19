import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../controllers/AppStore';
import { BankSysColors } from '../components/BankSysColors';

export default function LoginScreen() {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAppStore();

  const formatCPF = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    
    // Apply CPF formatting
    const formatted = cleaned
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .slice(0, 14);
    
    setCpf(formatted);
  };

  const handleLogin = async () => {
    if (!cpf || cpf.length < 14) {
      Alert.alert('Erro', 'Por favor, insira um CPF válido');
      return;
    }
    
    if (!password || password.length < 4) {
      Alert.alert('Erro', 'Por favor, insira sua senha');
      return;
    }

    try {
      setLoading(true);
      // Remove CPF formatting for API call
      const cleanCpf = cpf.replace(/\D/g, '');
      await login(cleanCpf, password);
    } catch (error: any) {
      Alert.alert('Erro no Login', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <View style={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>BankSys</Text>
            </View>
            <Text style={styles.subtitle}>Seu banco digital completo</Text>
          </View>

          {/* Login Form */}
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>Entrar na sua conta</Text>
            
            {/* CPF Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>CPF</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color={BankSysColors.mediumGray} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChangeText={formatCPF}
                  keyboardType="numeric"
                  maxLength={14}
                  placeholderTextColor={BankSysColors.mediumGray}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Senha</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color={BankSysColors.mediumGray} style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, styles.passwordInput]}
                  placeholder="Digite sua senha"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor={BankSysColors.mediumGray}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons 
                    name={showPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color={BankSysColors.mediumGray} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={BankSysColors.white} />
              ) : (
                <Text style={styles.loginButtonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
            </TouchableOpacity>
          </View>

          {/* Demo Info */}
          <View style={styles.demoInfo}>
            <Text style={styles.demoTitle}>Demo BankSys</Text>
            <Text style={styles.demoText}>Para testar, registre-se primeiro ou use:</Text>
            <Text style={styles.demoCredentials}>Qualquer CPF válido + senha</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BankSysColors.screenBackground,
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: BankSysColors.red,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: BankSysColors.white,
  },
  subtitle: {
    fontSize: 16,
    color: BankSysColors.mediumGray,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 32,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BankSysColors.darkGray,
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: BankSysColors.darkGray,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BankSysColors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BankSysColors.lightBorder,
    paddingHorizontal: 16,
    height: 48,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: BankSysColors.darkGray,
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
  },
  loginButton: {
    backgroundColor: BankSysColors.red,
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: BankSysColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPasswordButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    color: BankSysColors.red,
    fontSize: 14,
    fontWeight: '500',
  },
  demoInfo: {
    backgroundColor: BankSysColors.yellowLight,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BankSysColors.darkGray,
    marginBottom: 8,
  },
  demoText: {
    fontSize: 14,
    color: BankSysColors.darkGray,
    textAlign: 'center',
    marginBottom: 4,
  },
  demoCredentials: {
    fontSize: 14,
    fontWeight: '600',
    color: BankSysColors.darkGray,
    textAlign: 'center',
  },
});