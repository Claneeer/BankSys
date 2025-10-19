import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface LoginForm {
  cpf: string;
  password: string;
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<LoginForm>();
  
  const cpfValue = watch('cpf') || '';

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const formatted = numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .slice(0, 14);
    return formatted;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setValue('cpf', formatted);
  };

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      const cleanCPF = data.cpf.replace(/\D/g, '');
      
      if (cleanCPF.length !== 11) {
        toast.error('CPF deve ter 11 dígitos');
        return;
      }

      await login(cleanCPF, data.password);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setValue('cpf', '123.456.789-01');
    setValue('password', 'senha123');
  };

  return (
    <LoginContainer>
      <LoginCard
        as={motion.div}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Logo>
          <LogoIcon>🏦</LogoIcon>
          <LogoText>BankSys</LogoText>
        </Logo>

        <Title>Entrar na sua conta</Title>
        <Subtitle>Acesse seu banco digital</Subtitle>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputGroup>
            <Label>CPF</Label>
            <InputWrapper>
              <InputIcon>
                <FiUser size={20} />
              </InputIcon>
              <Input
                type="text"
                placeholder="000.000.000-00"
                {...register('cpf', { 
                  required: 'CPF é obrigatório',
                  minLength: { value: 14, message: 'CPF inválido' }
                })}
                onChange={handleCPFChange}
                value={cpfValue}
                error={!!errors.cpf}
              />
            </InputWrapper>
            {errors.cpf && <ErrorMessage>{errors.cpf.message}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label>Senha</Label>
            <InputWrapper>
              <InputIcon>
                <FiLock size={20} />
              </InputIcon>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                {...register('password', { 
                  required: 'Senha é obrigatória',
                  minLength: { value: 4, message: 'Senha muito curta' }
                })}
                error={!!errors.password}
              />
              <TogglePassword
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </TogglePassword>
            </InputWrapper>
            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
          </InputGroup>

          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                Entrar
                <FiArrowRight size={20} />
              </>
            )}
          </LoginButton>
        </Form>

        <DemoSection>
          <DemoTitle>Demo BankSys</DemoTitle>
          <DemoText>Use as credenciais abaixo para testar:</DemoText>
          <DemoCredentials>
            <DemoItem>
              <strong>CPF:</strong> 123.456.789-01
            </DemoItem>
            <DemoItem>
              <strong>Senha:</strong> senha123
            </DemoItem>
          </DemoCredentials>
          <DemoButton type="button" onClick={fillDemoCredentials}>
            Preencher Dados Demo
          </DemoButton>
        </DemoSection>

        <Links>
          <Link href="/apresentacao">← Voltar para apresentação</Link>
        </Links>
      </LoginCard>

      <Background />
    </LoginContainer>
  );
};

// Styled Components
const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.1"><circle cx="30" cy="30" r="4"/></g></svg>') repeat;
  z-index: -1;
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const LogoIcon = styled.div`
  font-size: 2.5rem;
`;

const LogoText = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-red);
  margin: 0;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-dark-gray);
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Subtitle = styled.p`
  color: var(--color-medium-gray);
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: var(--color-dark-gray);
  font-size: 0.95rem;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  color: var(--color-medium-gray);
  z-index: 1;
`;

const Input = styled.input<{ error: boolean }>`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid ${props => props.error ? 'var(--color-error)' : 'var(--color-light-border)'};
  border-radius: var(--border-radius-md);
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  
  &:focus {
    border-color: var(--color-red);
    box-shadow: 0 0 0 3px var(--color-red-transparent);
  }

  &::placeholder {
    color: var(--color-medium-gray);
  }
`;

const TogglePassword = styled.button`
  position: absolute;
  right: 1rem;
  color: var(--color-medium-gray);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  
  &:hover {
    color: var(--color-dark-gray);
  }
`;

const ErrorMessage = styled.span`
  color: var(--color-error);
  font-size: 0.875rem;
  font-weight: 500;
`;

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  background: var(--color-red);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: var(--color-red-dark);
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-left-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const DemoSection = styled.div`
  background: var(--color-yellow-light);
  padding: 1.5rem;
  border-radius: var(--border-radius-md);
  margin-bottom: 1.5rem;
`;

const DemoTitle = styled.h4`
  color: var(--color-dark-gray);
  margin: 0 0 0.5rem 0;
  font-weight: 600;
`;

const DemoText = styled.p`
  color: var(--color-dark-gray);
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
`;

const DemoCredentials = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
`;

const DemoItem = styled.div`
  font-size: 0.9rem;
  color: var(--color-dark-gray);
  font-family: 'Courier New', monospace;
`;

const DemoButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: var(--color-red);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--color-red-dark);
  }
`;

const Links = styled.div`
  text-align: center;
`;

const Link = styled.a`
  color: var(--color-red);
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default LoginPage;