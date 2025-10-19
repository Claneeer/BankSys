import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuthStore } from './stores/authStore';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import HomePage from './pages/HomePage';
import TransactionsPage from './pages/TransactionsPage';
import InvestmentsPage from './pages/InvestmentsPage';
import CardsPage from './pages/CardsPage';
import SettingsPage from './pages/SettingsPage';
import PresentationMode from './pages/PresentationMode';

function App() {
  const { isAuthenticated, initializeAuth, isLoading } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return null; // O loading screen do HTML será mostrado
  }

  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Modo Apresentação - Acesso público */}
        <Route path="/apresentacao" element={<PresentationMode />} />
        
        {/* Login */}
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />
          } 
        />
        
        {/* Dashboard Protegido */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <HomePage />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        <Route 
          path="/dashboard/transacoes" 
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <TransactionsPage />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        <Route 
          path="/dashboard/investimentos" 
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <InvestmentsPage />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        <Route 
          path="/dashboard/cartoes" 
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <CardsPage />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        <Route 
          path="/dashboard/configuracoes" 
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <SettingsPage />
              </DashboardLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        {/* Redirecionamentos */}
        <Route path="/" element={<Navigate to="/apresentacao" replace />} />
        <Route path="*" element={<Navigate to="/apresentacao" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;