import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiList, FiTrendingUp, FiCreditCard, FiSettings, FiLogOut, FiUser, FiBell, FiMenu } from 'react-icons/fi';
import { useAuthStore } from '../stores/authStore';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Início', exact: true },
    { path: '/dashboard/transacoes', icon: FiList, label: 'Transações' },
    { path: '/dashboard/investimentos', icon: FiTrendingUp, label: 'Investimentos' },
    { path: '/dashboard/cartoes', icon: FiCreditCard, label: 'Cartões' },
    { path: '/dashboard/configuracoes', icon: FiSettings, label: 'Configurações' },
  ];

  return (
    <DashboardContainer>
      <Sidebar>
        <SidebarHeader>
          <Logo>
            <LogoIcon>🏦</LogoIcon>
            <LogoText>BankSys</LogoText>
          </Logo>
        </SidebarHeader>

        <Navigation>
          {menuItems.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              end={item.exact}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavItem>
          ))}
        </Navigation>

        <SidebarFooter>
          <UserInfo>
            <UserAvatar>
              <FiUser size={20} />
            </UserAvatar>
            <UserDetails>
              <UserName>{user?.full_name?.split(' ')[0]}</UserName>
              <UserRole>Cliente Premium</UserRole>
            </UserDetails>
          </UserInfo>
          
          <LogoutButton onClick={handleLogout}>
            <FiLogOut size={20} />
            <span>Sair</span>
          </LogoutButton>
        </SidebarFooter>
      </Sidebar>

      <MainContent>
        <Header>
          <HeaderLeft>
            <MenuToggle>
              <FiMenu size={24} />
            </MenuToggle>
            <Breadcrumb>Dashboard</Breadcrumb>
          </HeaderLeft>
          
          <HeaderRight>
            <NotificationButton>
              <FiBell size={20} />
              <NotificationBadge>3</NotificationBadge>
            </NotificationButton>
            
            <UserProfileButton>
              <FiUser size={20} />
            </UserProfileButton>
          </HeaderRight>
        </Header>

        <ContentArea
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </ContentArea>
      </MainContent>
    </DashboardContainer>
  );
};

// Styled Components
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--color-light-gray);
`;

const Sidebar = styled.aside`
  width: 280px;
  background: white;
  border-right: 1px solid var(--color-light-border);
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-md);
  z-index: 100;
  
  @media (max-width: 768px) {
    width: 70px;
  }
`;

const SidebarHeader = styled.div`
  padding: 2rem 1.5rem;
  border-bottom: 1px solid var(--color-light-border);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const LogoIcon = styled.div`
  font-size: 1.75rem;
`;

const LogoText = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-red);
  margin: 0;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Navigation = styled.nav`
  flex: 1;
  padding: 1rem 0;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  color: var(--color-medium-gray);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  
  &:hover {
    background: var(--color-light-gray);
    color: var(--color-dark-gray);
  }
  
  &.active {
    background: var(--color-red-transparent);
    color: var(--color-red);
    border-left-color: var(--color-red);
    
    svg {
      color: var(--color-red);
    }
  }
  
  span {
    @media (max-width: 768px) {
      display: none;
    }
  }
  
  @media (max-width: 768px) {
    justify-content: center;
    padding: 1rem;
  }
`;

const SidebarFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid var(--color-light-border);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  background: var(--color-red);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const UserDetails = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const UserName = styled.div`
  font-weight: 600;
  color: var(--color-dark-gray);
  font-size: 0.9rem;
`;

const UserRole = styled.div`
  font-size: 0.8rem;
  color: var(--color-medium-gray);
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background: none;
  border: 1px solid var(--color-light-border);
  border-radius: var(--border-radius-md);
  color: var(--color-medium-gray);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--color-error);
    color: white;
    border-color: var(--color-error);
  }
  
  span {
    @media (max-width: 768px) {
      display: none;
    }
  }
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.header`
  background: white;
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--color-light-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-sm);
  z-index: 90;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MenuToggle = styled.button`
  background: none;
  border: none;
  color: var(--color-medium-gray);
  cursor: pointer;
  padding: 0.5rem;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const Breadcrumb = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-dark-gray);
  margin: 0;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NotificationButton = styled.button`
  position: relative;
  background: none;
  border: none;
  color: var(--color-medium-gray);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--color-light-gray);
    color: var(--color-dark-gray);
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background: var(--color-red);
  color: white;
  font-size: 0.7rem;
  padding: 0.125rem 0.375rem;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
`;

const UserProfileButton = styled.button`
  background: var(--color-red);
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--color-red-dark);
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export default DashboardLayout;