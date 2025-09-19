import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../controllers/AppStore';
import { BankSysColors } from '../components/BankSysColors';
import TransactionController from '../../controllers/TransactionController';

export default function HomeScreen() {
  const {
    user,
    balance,
    creditCards,
    showBalance,
    refreshBalance,
    refreshCreditCards,
    toggleBalanceVisibility,
  } = useAppStore();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refreshBalance(),
        refreshCreditCards(),
      ]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const createSampleData = async () => {
    try {
      await TransactionController.seedSampleData();
      Alert.alert('Sucesso', 'Dados de exemplo criados!');
      await onRefresh();
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const quickActions = [
    { name: 'PIX', icon: 'qr-code', color: BankSysColors.red },
    { name: 'Pagar Conta', icon: 'card', color: BankSysColors.yellow },
    { name: 'Transferir', icon: 'arrow-forward', color: BankSysColors.success },
    { name: 'Recarga', icon: 'phone-portrait', color: BankSysColors.info },
  ];

  const primaryCreditCard = creditCards[0];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[BankSysColors.red]}
            tintColor={BankSysColors.red}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.profileIcon}>
              <Text style={styles.profileInitials}>
                {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
            <View>
              <Text style={styles.greeting}>Olá,</Text>
              <Text style={styles.userName}>{user?.full_name?.split(' ')[0]}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="notifications-outline" size={24} color={BankSysColors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="qr-code-outline" size={24} color={BankSysColors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Saldo em conta</Text>
            <TouchableOpacity onPress={toggleBalanceVisibility}>
              <Ionicons 
                name={showBalance ? "eye-outline" : "eye-off-outline"} 
                size={20} 
                color={BankSysColors.mediumGray} 
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>
            {showBalance && balance ? formatCurrency(balance.balance) : '•••••'}
          </Text>
          <Text style={styles.accountNumber}>
            Conta: {balance?.account_number || '•••••'}
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Ações rápidas</Text>
          <View style={styles.quickActions}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.quickAction}>
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon as any} size={24} color={BankSysColors.white} />
                </View>
                <Text style={styles.quickActionText}>{action.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Credit Card */}
        {primaryCreditCard && (
          <View style={styles.creditCardContainer}>
            <Text style={styles.sectionTitle}>Cartão de crédito</Text>
            <View style={styles.creditCard}>
              <View style={styles.creditCardHeader}>
                <Text style={styles.creditCardName}>{primaryCreditCard.card_name}</Text>
                <Text style={styles.creditCardNumber}>{primaryCreditCard.card_number}</Text>
              </View>
              <View style={styles.creditCardBody}>
                <View style={styles.creditCardInfo}>
                  <Text style={styles.creditCardLabel}>Fatura atual</Text>
                  <Text style={styles.creditCardAmount}>
                    {formatCurrency(primaryCreditCard.current_balance)}
                  </Text>
                </View>
                <View style={styles.creditCardInfo}>
                  <Text style={styles.creditCardLabel}>Limite disponível</Text>
                  <Text style={styles.creditCardAvailable}>
                    {formatCurrency(primaryCreditCard.available_limit)}
                  </Text>
                </View>
              </View>
              <View style={styles.creditCardFooter}>
                <Text style={styles.creditCardDue}>
                  Vencimento: {new Date(primaryCreditCard.due_date).toLocaleDateString('pt-BR')}
                </Text>
                <TouchableOpacity style={styles.payButton}>
                  <Text style={styles.payButtonText}>Pagar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Loans Section */}
        <View style={styles.loansContainer}>
          <Text style={styles.sectionTitle}>Empréstimos</Text>
          <View style={styles.loanCard}>
            <View style={styles.loanHeader}>
              <Ionicons name="trending-up" size={24} color={BankSysColors.success} />
              <Text style={styles.loanTitle}>Simule seu empréstimo</Text>
            </View>
            <Text style={styles.loanDescription}>
              Taxas a partir de 1,2% ao mês. Simule e contrate online.
            </Text>
            <TouchableOpacity style={styles.simulateButton}>
              <Text style={styles.simulateButtonText}>Simular empréstimo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Demo Actions */}
        <View style={styles.demoContainer}>
          <Text style={styles.sectionTitle}>Demo BankSys</Text>
          <TouchableOpacity style={styles.demoButton} onPress={createSampleData}>
            <Ionicons name="add-circle-outline" size={20} color={BankSysColors.red} />
            <Text style={styles.demoButtonText}>Criar dados de exemplo</Text>
          </TouchableOpacity>
        </View>
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
  header: {
    backgroundColor: BankSysColors.red,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BankSysColors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileInitials: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BankSysColors.red,
  },
  greeting: {
    color: BankSysColors.white,
    fontSize: 14,
  },
  userName: {
    color: BankSysColors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
  },
  balanceCard: {
    backgroundColor: BankSysColors.white,
    margin: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: BankSysColors.mediumGray,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: BankSysColors.darkGray,
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 14,
    color: BankSysColors.mediumGray,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BankSysColors.darkGray,
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: BankSysColors.darkGray,
    textAlign: 'center',
  },
  creditCardContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  creditCard: {
    backgroundColor: BankSysColors.darkGray,
    borderRadius: 12,
    padding: 20,
  },
  creditCardHeader: {
    marginBottom: 16,
  },
  creditCardName: {
    color: BankSysColors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  creditCardNumber: {
    color: BankSysColors.white,
    fontSize: 18,
    fontWeight: '500',
  },
  creditCardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  creditCardInfo: {
    flex: 1,
  },
  creditCardLabel: {
    color: BankSysColors.lightGray,
    fontSize: 12,
    marginBottom: 4,
  },
  creditCardAmount: {
    color: BankSysColors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  creditCardAvailable: {
    color: BankSysColors.success,
    fontSize: 16,
    fontWeight: 'bold',
  },
  creditCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creditCardDue: {
    color: BankSysColors.lightGray,
    fontSize: 12,
  },
  payButton: {
    backgroundColor: BankSysColors.yellow,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  payButtonText: {
    color: BankSysColors.black,
    fontSize: 14,
    fontWeight: 'bold',
  },
  loansContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  loanCard: {
    backgroundColor: BankSysColors.white,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  loanTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BankSysColors.darkGray,
    marginLeft: 8,
  },
  loanDescription: {
    fontSize: 14,
    color: BankSysColors.mediumGray,
    marginBottom: 16,
  },
  simulateButton: {
    backgroundColor: BankSysColors.red,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  simulateButtonText: {
    color: BankSysColors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  demoContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BankSysColors.white,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BankSysColors.red,
  },
  demoButtonText: {
    color: BankSysColors.red,
    fontWeight: '600',
    marginLeft: 8,
  },
});