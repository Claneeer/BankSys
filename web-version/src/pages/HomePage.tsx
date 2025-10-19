import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff, FiCreditCard, FiTrendingUp, FiArrowUpRight, FiArrowDownLeft, FiRefreshCw, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useBankStore } from '../stores/bankStore';
import { useAuthStore } from '../stores/authStore';

const HomePage = () => {
  const { user } = useAuthStore();
  const { 
    account, 
    creditCards, 
    transactions, 
    showBalance, 
    isLoading,
    fetchAccountData, 
    fetchCreditCards, 
    fetchTransactions, 
    createSampleData, 
    toggleBalanceVisibility,
    refreshAllData 
  } = useBankStore();

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    refreshAllData();
  }, []);

  const handleCreateSampleData = async () => {
    try {
      await createSampleData();
      toast.success('Dados de exemplo criados com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar dados de exemplo');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshAllData();
    setIsRefreshing(false);
    toast.success('Dados atualizados!');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const quickActions = [
    { icon: FiArrowUpRight, label: 'PIX', color: '#FF0000' },
    { icon: FiCreditCard, label: 'Pagar Conta', color: '#FFC700' },
    { icon: FiArrowDownLeft, label: 'Transferir', color: '#28A745' },
    { icon: FiTrendingUp, label: 'Investir', color: '#17A2B8' },
  ];

  const primaryCreditCard = creditCards[0];
  const recentTransactions = transactions.slice(0, 5);

  return (
    <HomeContainer>
      <WelcomeSection>
        <WelcomeText>
          <Greeting>{getGreeting()}, {user?.full_name?.split(' ')[0]}!</Greeting>
          <WelcomeSubtext>Gerencie suas finanças de forma inteligente</WelcomeSubtext>
        </WelcomeText>
        
        <ActionButtons>
          <ActionButton onClick={handleRefresh} disabled={isRefreshing}>
            <FiRefreshCw className={isRefreshing ? 'spinning' : ''} size={20} />
            Atualizar
          </ActionButton>
          <ActionButton onClick={handleCreateSampleData}>
            <FiPlus size={20} />
            Dados Demo
          </ActionButton>
        </ActionButtons>
      </WelcomeSection>

      <CardsGrid>
        {/* Account Balance Card */}
        <BalanceCard
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CardHeader>
            <CardTitle>Saldo em Conta</CardTitle>
            <ToggleButton onClick={toggleBalanceVisibility}>
              {showBalance ? <FiEye size={20} /> : <FiEyeOff size={20} />}
            </ToggleButton>
          </CardHeader>
          
          <BalanceAmount>
            {showBalance && account ? formatCurrency(account.balance) : '•••••'}
          </BalanceAmount>
          
          <AccountInfo>
            Conta: {account?.account_number || '•••••'}
          </AccountInfo>
        </BalanceCard>

        {/* Credit Card */}
        {primaryCreditCard && (
          <CreditCardWidget
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CardHeader>
              <CardTitle>{primaryCreditCard.card_name}</CardTitle>
              <FiCreditCard size={24} color="white" />
            </CardHeader>
            
            <CreditCardNumber>
              {primaryCreditCard.card_number}
            </CreditCardNumber>
            
            <CreditCardInfo>
              <div>
                <CreditCardLabel>Fatura atual</CreditCardLabel>
                <CreditCardValue>
                  {formatCurrency(primaryCreditCard.current_balance)}
                </CreditCardValue>
              </div>
              <div>
                <CreditCardLabel>Limite disponível</CreditCardLabel>
                <CreditCardAvailable>
                  {formatCurrency(primaryCreditCard.available_limit)}
                </CreditCardAvailable>
              </div>
            </CreditCardInfo>
            
            <PayButton>
              Pagar Fatura
            </PayButton>
          </CreditCardWidget>
        )}
      </CardsGrid>

      {/* Quick Actions */}
      <Section>
        <SectionTitle>Ações Rápidas</SectionTitle>
        <QuickActionsGrid>
          {quickActions.map((action, index) => (
            <QuickActionCard
              key={action.label}
              as={motion.div}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <QuickActionIcon color={action.color}>
                <action.icon size={24} />
              </QuickActionIcon>
              <QuickActionLabel>{action.label}</QuickActionLabel>
            </QuickActionCard>
          ))}
        </QuickActionsGrid>
      </Section>

      {/* Recent Transactions */}
      <Section>
        <SectionHeader>
          <SectionTitle>Transações Recentes</SectionTitle>
          <SeeAllLink>Ver todas</SeeAllLink>
        </SectionHeader>
        
        {isLoading ? (
          <LoadingCard>Carregando transações...</LoadingCard>
        ) : recentTransactions.length > 0 ? (
          <TransactionsList>
            {recentTransactions.map((transaction, index) => (
              <TransactionItem
                key={transaction.id}
                as={motion.div}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <TransactionIcon type={transaction.transaction_type}>
                  {transaction.transaction_type.includes('pix') ? '💱' :
                   transaction.transaction_type === 'credit' ? '💰' :
                   transaction.transaction_type === 'debit' ? '🛒' : '💳'}
                </TransactionIcon>
                
                <TransactionInfo>
                  <TransactionTitle>{transaction.description}</TransactionTitle>
                  <TransactionMeta>
                    {transaction.merchant_name || transaction.recipient_name || 'BankSys'} • {formatDate(transaction.transaction_date)}
                  </TransactionMeta>
                </TransactionInfo>
                
                <TransactionAmount type={transaction.transaction_type}>
                  {transaction.transaction_type === 'credit' || transaction.transaction_type === 'pix_received' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </TransactionAmount>
              </TransactionItem>
            ))}
          </TransactionsList>
        ) : (
          <EmptyState>
            <FiCreditCard size={48} color="var(--color-medium-gray)" />
            <EmptyStateText>Nenhuma transação encontrada</EmptyStateText>
            <EmptyStateSubtext>
              Suas transações aparecerão aqui
            </EmptyStateSubtext>
          </EmptyState>
        )}
      </Section>
    </HomeContainer>
  );
};

// Styled Components
const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`;

const WelcomeText = styled.div``;

const Greeting = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-dark-gray);
  margin: 0 0 0.25rem 0;
`;

const WelcomeSubtext = styled.p`
  color: var(--color-medium-gray);
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid var(--color-light-border);
  border-radius: var(--border-radius-md);
  color: var(--color-dark-gray);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    border-color: var(--color-red);
    color: var(--color-red);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .spinning {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const BalanceCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-light-border);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-medium-gray);
  margin: 0;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: var(--color-medium-gray);
  cursor: pointer;
  padding: 0.25rem;
  
  &:hover {
    color: var(--color-dark-gray);
  }
`;

const BalanceAmount = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--color-dark-gray);
  margin-bottom: 0.5rem;
`;

const AccountInfo = styled.div`
  color: var(--color-medium-gray);
  font-size: 0.9rem;
`;

const CreditCardWidget = styled.div`
  background: linear-gradient(135deg, var(--color-dark-gray) 0%, var(--color-black) 100%);
  color: white;
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
`;

const CreditCardNumber = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 2px;
  margin-bottom: 1.5rem;
  font-family: 'Courier New', monospace;
`;

const CreditCardInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const CreditCardLabel = styled.div`
  font-size: 0.8rem;
  opacity: 0.8;
  margin-bottom: 0.25rem;
`;

const CreditCardValue = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
`;

const CreditCardAvailable = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-success);
`;

const PayButton = styled.button`
  background: var(--color-yellow);
  color: var(--color-black);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--color-yellow-light);
  }
`;

const Section = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-light-border);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-dark-gray);
  margin: 0;
`;

const SeeAllLink = styled.button`
  background: none;
  border: none;
  color: var(--color-red);
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
`;

const QuickActionCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1rem;
  border: 1px solid var(--color-light-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--color-red);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const QuickActionIcon = styled.div<{ color: string }>`
  width: 50px;
  height: 50px;
  background: ${props => props.color};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 0.75rem;
`;

const QuickActionLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-dark-gray);
  text-align: center;
`;

const TransactionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TransactionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--color-light-border);
  border-radius: var(--border-radius-md);
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--color-light-gray);
  }
`;

const TransactionIcon = styled.div<{ type: string }>`
  width: 40px;
  height: 40px;
  background: ${props => {
    if (props.type === 'credit' || props.type === 'pix_received') return 'var(--color-success)';
    return 'var(--color-red)';
  }};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const TransactionInfo = styled.div`
  flex: 1;
`;

const TransactionTitle = styled.div`
  font-weight: 600;
  color: var(--color-dark-gray);
  margin-bottom: 0.25rem;
`;

const TransactionMeta = styled.div`
  font-size: 0.8rem;
  color: var(--color-medium-gray);
`;

const TransactionAmount = styled.div<{ type: string }>`
  font-weight: 600;
  font-size: 1rem;
  color: ${props => {
    if (props.type === 'credit' || props.type === 'pix_received') return 'var(--color-success)';
    return 'var(--color-red)';
  }};
`;

const LoadingCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--color-medium-gray);
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  text-align: center;
`;

const EmptyStateText = styled.h4`
  color: var(--color-dark-gray);
  margin: 1rem 0 0.5rem 0;
`;

const EmptyStateSubtext = styled.p`
  color: var(--color-medium-gray);
  margin: 0;
`;

export default HomePage;