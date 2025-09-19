import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useAppStore } from '../../controllers/AppStore';
import TransactionController from '../../controllers/TransactionController';
import { BankSysColors } from '../components/BankSysColors';
import { Transaction, TransactionType } from '../../models/Transaction';

export default function TransactionsScreen() {
  const { transactions, transactionsLoading, refreshTransactions } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    loadAnalytics();
  }, [transactions]);

  const loadAnalytics = async () => {
    try {
      const analyticsData = await TransactionController.getAnalytics(6);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshTransactions();
      await loadAnalytics();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.PIX_SENT:
      case TransactionType.PIX_RECEIVED:
        return 'qr-code';
      case TransactionType.BILL_PAYMENT:
        return 'card';
      case TransactionType.TRANSFER:
        return 'arrow-forward';
      case TransactionType.INVESTMENT:
        return 'trending-up';
      case TransactionType.CREDIT:
        return 'arrow-down';
      case TransactionType.DEBIT:
        return 'arrow-up';
      default:
        return 'swap-horizontal';
    }
  };

  const getTransactionColor = (type: TransactionType) => {
    if (type === TransactionType.CREDIT || type === TransactionType.PIX_RECEIVED) {
      return BankSysColors.success;
    }
    return BankSysColors.expense;
  };

  const getTransactionPrefix = (type: TransactionType) => {
    if (type === TransactionType.CREDIT || type === TransactionType.PIX_RECEIVED) {
      return '+';
    }
    return '-';
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={[styles.transactionIcon, { backgroundColor: getTransactionColor(item.transaction_type) }]}>
        <Ionicons 
          name={getTransactionIcon(item.transaction_type) as any} 
          size={20} 
          color={BankSysColors.white} 
        />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDescription} numberOfLines={1}>
          {item.description}
        </Text>
        <Text style={styles.transactionMerchant} numberOfLines={1}>
          {item.merchant_name || item.recipient_name || 'BankSys'}
        </Text>
        <Text style={styles.transactionDate}>
          {formatDate(item.transaction_date)}
        </Text>
      </View>
      <View style={styles.transactionAmount}>
        <Text style={[styles.transactionValue, { color: getTransactionColor(item.transaction_type) }]}>
          {getTransactionPrefix(item.transaction_type)}{formatCurrency(item.amount)}
        </Text>
        <Text style={styles.transactionStatus}>{item.status}</Text>
      </View>
    </View>
  );

  if (transactionsLoading && !refreshing) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={BankSysColors.red} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[BankSysColors.red]}
            tintColor={BankSysColors.red}
          />
        }
      >
        {/* Analytics Summary */}
        {analytics && (
          <View style={styles.analyticsContainer}>
            <Text style={styles.sectionTitle}>Resumo mensal</Text>
            <View style={styles.analyticsGrid}>
              <View style={styles.analyticsCard}>
                <Text style={styles.analyticsLabel}>Receitas</Text>
                <Text style={[styles.analyticsValue, { color: BankSysColors.success }]}>
                  {formatCurrency(analytics.total_income)}
                </Text>
              </View>
              <View style={styles.analyticsCard}>
                <Text style={styles.analyticsLabel}>Gastos</Text>
                <Text style={[styles.analyticsValue, { color: BankSysColors.expense }]}>
                  {formatCurrency(analytics.total_expenses)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Category Breakdown */}
        {analytics && analytics.category_breakdown.length > 0 && (
          <View style={styles.categoryContainer}>
            <Text style={styles.sectionTitle}>Gastos por categoria</Text>
            {analytics.category_breakdown.slice(0, 5).map((category: any, index: number) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.category}</Text>
                  <Text style={styles.categoryAmount}>
                    {formatCurrency(category.amount)}
                  </Text>
                </View>
                <View style={styles.categoryBar}>
                  <View 
                    style={[
                      styles.categoryProgress, 
                      { 
                        width: `${Math.min((category.amount / analytics.total_expenses) * 100, 100)}%`,
                        backgroundColor: BankSysColors.red
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Transactions List */}
        <View style={styles.transactionsContainer}>
          <Text style={styles.sectionTitle}>Últimas transações</Text>
          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={48} color={BankSysColors.mediumGray} />
              <Text style={styles.emptyStateTitle}>Nenhuma transação encontrada</Text>
              <Text style={styles.emptyStateText}>
                Suas transações aparecerão aqui
              </Text>
            </View>
          ) : (
            <View style={styles.transactionsList}>
              {transactions.map((transaction, index) => (
                <View key={transaction.id || index}>
                  {renderTransaction({ item: transaction })}
                </View>
              ))}
            </View>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyticsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BankSysColors.darkGray,
    marginBottom: 16,
  },
  analyticsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  analyticsCard: {
    flex: 1,
    backgroundColor: BankSysColors.white,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  analyticsLabel: {
    fontSize: 14,
    color: BankSysColors.mediumGray,
    marginBottom: 4,
  },
  analyticsValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoryContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  categoryItem: {
    backgroundColor: BankSysColors.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  categoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: BankSysColors.darkGray,
    textTransform: 'capitalize',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: BankSysColors.darkGray,
  },
  categoryBar: {
    height: 4,
    backgroundColor: BankSysColors.lightBorder,
    borderRadius: 2,
  },
  categoryProgress: {
    height: '100%',
    borderRadius: 2,
  },
  transactionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  transactionsList: {
    backgroundColor: BankSysColors.white,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: BankSysColors.lightBorder,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: BankSysColors.darkGray,
    marginBottom: 2,
  },
  transactionMerchant: {
    fontSize: 14,
    color: BankSysColors.mediumGray,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: BankSysColors.mediumGray,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  transactionStatus: {
    fontSize: 12,
    color: BankSysColors.mediumGray,
    textTransform: 'capitalize',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: BankSysColors.white,
    borderRadius: 8,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BankSysColors.darkGray,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: BankSysColors.mediumGray,
    textAlign: 'center',
  },
});