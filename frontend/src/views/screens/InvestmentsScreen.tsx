import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BankSysColors } from '../components/BankSysColors';

export default function InvestmentsScreen() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const mockInvestments = [
    {
      id: '1',
      name: 'Bitcoin',
      symbol: 'BTC',
      type: 'cryptocurrency',
      amount: 0.01,
      value: 950.00,
      change: 2.5,
      changePercent: 0.26,
    },
    {
      id: '2',
      name: 'CDB Prefixado',
      symbol: 'CDB',
      type: 'cdb',
      amount: 1,
      value: 5025.00,
      change: 25.00,
      changePercent: 0.50,
    },
  ];

  const mockCryptos = [
    { symbol: 'BTC', name: 'Bitcoin', price: 95000.00, change: 1.28 },
    { symbol: 'ETH', name: 'Ethereum', price: 3850.00, change: -1.15 },
    { symbol: 'ADA', name: 'Cardano', price: 1.25, change: 6.84 },
  ];

  const mockCDBs = [
    {
      name: 'CDB Prefixado 100% CDI',
      rate: 12.5,
      minAmount: 1000,
      term: '12 meses',
    },
    {
      name: 'CDB Pós-fixado 110% CDI',
      rate: 13.75,
      minAmount: 5000,
      term: '24 meses',
    },
  ];

  const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.value, 0);
  const totalChange = mockInvestments.reduce((sum, inv) => sum + inv.change, 0);
  const totalChangePercent = totalInvested > 0 ? (totalChange / totalInvested) * 100 : 0;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        {/* Portfolio Summary */}
        <View style={styles.portfolioContainer}>
          <Text style={styles.sectionTitle}>Meu Portfólio</Text>
          <View style={styles.portfolioCard}>
            <Text style={styles.portfolioLabel}>Valor total investido</Text>
            <Text style={styles.portfolioValue}>{formatCurrency(totalInvested)}</Text>
            <View style={styles.portfolioChange}>
              <Ionicons 
                name={totalChange >= 0 ? "trending-up" : "trending-down"} 
                size={16} 
                color={totalChange >= 0 ? BankSysColors.success : BankSysColors.error} 
              />
              <Text style={[
                styles.portfolioChangeText,
                { color: totalChange >= 0 ? BankSysColors.success : BankSysColors.error }
              ]}>
                {formatCurrency(Math.abs(totalChange))} ({totalChangePercent.toFixed(2)}%)
              </Text>
            </View>
          </View>
        </View>

        {/* My Investments */}
        <View style={styles.investmentsContainer}>
          <Text style={styles.sectionTitle}>Meus Investimentos</Text>
          {mockInvestments.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="trending-up-outline" size={48} color={BankSysColors.mediumGray} />
              <Text style={styles.emptyStateTitle}>Nenhum investimento ainda</Text>
              <Text style={styles.emptyStateText}>
                Comece a investir e acompanhe seus rendimentos aqui
              </Text>
            </View>
          ) : (
            mockInvestments.map((investment) => (
              <View key={investment.id} style={styles.investmentCard}>
                <View style={styles.investmentHeader}>
                  <View>
                    <Text style={styles.investmentName}>{investment.name}</Text>
                    <Text style={styles.investmentType}>
                      {investment.type === 'cryptocurrency' ? 'Criptomoeda' : 'CDB'}
                    </Text>
                  </View>
                  <View style={styles.investmentAmount}>
                    <Text style={styles.investmentValue}>
                      {formatCurrency(investment.value)}
                    </Text>
                    <View style={styles.investmentChange}>
                      <Ionicons 
                        name={investment.change >= 0 ? "arrow-up" : "arrow-down"} 
                        size={12} 
                        color={investment.change >= 0 ? BankSysColors.success : BankSysColors.error} 
                      />
                      <Text style={[
                        styles.investmentChangeText,
                        { color: investment.change >= 0 ? BankSysColors.success : BankSysColors.error }
                      ]}>
                        {investment.changePercent.toFixed(2)}%
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Cryptocurrencies */}
        <View style={styles.cryptoContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Criptomoedas</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          {mockCryptos.map((crypto, index) => (
            <TouchableOpacity key={index} style={styles.cryptoCard}>
              <View style={styles.cryptoInfo}>
                <View style={styles.cryptoIcon}>
                  <Text style={styles.cryptoSymbol}>{crypto.symbol}</Text>
                </View>
                <View>
                  <Text style={styles.cryptoName}>{crypto.name}</Text>
                  <Text style={styles.cryptoSymbolText}>{crypto.symbol}</Text>
                </View>
              </View>
              <View style={styles.cryptoPrice}>
                <Text style={styles.cryptoPriceValue}>
                  {formatCurrency(crypto.price)}
                </Text>
                <Text style={[
                  styles.cryptoChange,
                  { color: crypto.change >= 0 ? BankSysColors.success : BankSysColors.error }
                ]}>
                  {crypto.change >= 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* CDB Options */}
        <View style={styles.cdbContainer}>
          <Text style={styles.sectionTitle}>Opções de CDB</Text>
          {mockCDBs.map((cdb, index) => (
            <View key={index} style={styles.cdbCard}>
              <View style={styles.cdbHeader}>
                <Text style={styles.cdbName}>{cdb.name}</Text>
                <Text style={styles.cdbRate}>{cdb.rate}% a.a.</Text>
              </View>
              <View style={styles.cdbDetails}>
                <Text style={styles.cdbDetail}>
                  Mínimo: {formatCurrency(cdb.minAmount)}
                </Text>
                <Text style={styles.cdbDetail}>Prazo: {cdb.term}</Text>
              </View>
              <TouchableOpacity style={styles.investButton}>
                <Text style={styles.investButtonText}>Investir</Text>
              </TouchableOpacity>
            </View>
          ))}
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
  portfolioContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BankSysColors.darkGray,
    marginBottom: 16,
  },
  portfolioCard: {
    backgroundColor: BankSysColors.white,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  portfolioLabel: {
    fontSize: 14,
    color: BankSysColors.mediumGray,
    marginBottom: 8,
  },
  portfolioValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: BankSysColors.darkGray,
    marginBottom: 8,
  },
  portfolioChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  portfolioChangeText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  investmentsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  investmentCard: {
    backgroundColor: BankSysColors.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  investmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  investmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: BankSysColors.darkGray,
    marginBottom: 2,
  },
  investmentType: {
    fontSize: 12,
    color: BankSysColors.mediumGray,
    textTransform: 'uppercase',
  },
  investmentAmount: {
    alignItems: 'flex-end',
  },
  investmentValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BankSysColors.darkGray,
    marginBottom: 2,
  },
  investmentChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  investmentChangeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  seeAllButton: {
    color: BankSysColors.red,
    fontSize: 14,
    fontWeight: '600',
  },
  cryptoContainer: {
    paddingBottom: 20,
  },
  cryptoCard: {
    backgroundColor: BankSysColors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cryptoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cryptoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BankSysColors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cryptoSymbol: {
    fontSize: 12,
    fontWeight: 'bold',
    color: BankSysColors.black,
  },
  cryptoName: {
    fontSize: 16,
    fontWeight: '600',
    color: BankSysColors.darkGray,
    marginBottom: 2,
  },
  cryptoSymbolText: {
    fontSize: 12,
    color: BankSysColors.mediumGray,
  },
  cryptoPrice: {
    alignItems: 'flex-end',
  },
  cryptoPriceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BankSysColors.darkGray,
    marginBottom: 2,
  },
  cryptoChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  cdbContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cdbCard: {
    backgroundColor: BankSysColors.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cdbHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cdbName: {
    fontSize: 16,
    fontWeight: '600',
    color: BankSysColors.darkGray,
    flex: 1,
  },
  cdbRate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BankSysColors.success,
  },
  cdbDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cdbDetail: {
    fontSize: 12,
    color: BankSysColors.mediumGray,
  },
  investButton: {
    backgroundColor: BankSysColors.yellow,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  investButtonText: {
    color: BankSysColors.black,
    fontSize: 14,
    fontWeight: 'bold',
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