import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../controllers/AppStore';
import { BankSysColors } from '../components/BankSysColors';

export default function SettingsScreen() {
  const { user, logout } = useAppStore();

  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza de que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: logout },
      ]
    );
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const settingsSections = [
    {
      title: 'Conta',
      items: [
        { icon: 'person-outline', title: 'Dados pessoais', onPress: () => {} },
        { icon: 'card-outline', title: 'Cartões', onPress: () => {} },
        { icon: 'shield-checkmark-outline', title: 'Segurança', onPress: () => {} },
      ],
    },
    {
      title: 'Preferências',
      items: [
        { icon: 'notifications-outline', title: 'Notificações', onPress: () => {} },
        { icon: 'moon-outline', title: 'Tema do app', onPress: () => {} },
        { icon: 'language-outline', title: 'Idioma', onPress: () => {} },
      ],
    },
    {
      title: 'Suporte',
      items: [
        { icon: 'help-circle-outline', title: 'Central de ajuda', onPress: () => {} },
        { icon: 'chatbubble-outline', title: 'Fale conosco', onPress: () => {} },
        { icon: 'document-text-outline', title: 'Termos e condições', onPress: () => {} },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileIcon}>
            <Text style={styles.profileInitials}>
              {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.full_name}</Text>
            <Text style={styles.profileCPF}>
              CPF: {user?.cpf ? formatCPF(user.cpf) : '•••.•••.•••-••'}
            </Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
          <TouchableOpacity style={styles.editProfileButton}>
            <Ionicons name="create-outline" size={20} color={BankSysColors.red} />
          </TouchableOpacity>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.settingsItems}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.settingsItem,
                    itemIndex === section.items.length - 1 && styles.lastItem
                  ]}
                  onPress={item.onPress}
                >
                  <View style={styles.settingsItemLeft}>
                    <Ionicons name={item.icon as any} size={24} color={BankSysColors.mediumGray} />
                    <Text style={styles.settingsItemText}>{item.title}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={BankSysColors.mediumGray} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* App Information */}
        <View style={styles.appInfoSection}>
          <Text style={styles.sectionTitle}>Sobre o app</Text>
          <View style={styles.appInfoItems}>
            <View style={styles.appInfoItem}>
              <Text style={styles.appInfoLabel}>Versão</Text>
              <Text style={styles.appInfoValue}>1.0.0</Text>
            </View>
            <View style={styles.appInfoItem}>
              <Text style={styles.appInfoLabel}>BankSys</Text>
              <Text style={styles.appInfoValue}>Demo Banking App</Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={BankSysColors.error} />
            <Text style={styles.logoutButtonText}>Sair da conta</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BankSysColors.screenBackground,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: BankSysColors.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  profileIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: BankSysColors.red,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInitials: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BankSysColors.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BankSysColors.darkGray,
    marginBottom: 4,
  },
  profileCPF: {
    fontSize: 14,
    color: BankSysColors.mediumGray,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: BankSysColors.mediumGray,
  },
  editProfileButton: {
    padding: 8,
  },
  settingsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BankSysColors.darkGray,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  settingsItems: {
    backgroundColor: BankSysColors.white,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: BankSysColors.lightBorder,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItemText: {
    fontSize: 16,
    color: BankSysColors.darkGray,
    marginLeft: 12,
  },
  appInfoSection: {
    marginBottom: 20,
  },
  appInfoItems: {
    backgroundColor: BankSysColors.white,
    paddingVertical: 8,
  },
  appInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  appInfoLabel: {
    fontSize: 16,
    color: BankSysColors.darkGray,
  },
  appInfoValue: {
    fontSize: 16,
    color: BankSysColors.mediumGray,
  },
  logoutSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: BankSysColors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BankSysColors.error,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: BankSysColors.error,
    marginLeft: 8,
  },
  bottomPadding: {
    height: 20,
  },
});