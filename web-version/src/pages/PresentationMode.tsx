import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiPlay, FiMonitor, FiSmartphone, FiDatabase, FiCode, FiCreditCard, FiTrendingUp, FiShield, FiZap } from 'react-icons/fi';

const PresentationMode = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  const slides = [
    {
      id: 'intro',
      title: 'BankSys',
      subtitle: 'Sistema Bancário Digital Completo',
      content: 'Uma plataforma bancária moderna desenvolvida com tecnologias avançadas para oferecer a melhor experiência em serviços financeiros digitais.',
      icon: <FiCreditCard size={80} />,
      color: '#FF0000'
    },
    {
      id: 'features',
      title: 'Funcionalidades Principais',
      subtitle: 'Tudo que você precisa em um só lugar',
      content: [
        '🏦 Gestão completa de contas bancárias',
        '💳 Cartões de crédito e débito',
        '💱 Sistema PIX integrado',
        '📊 Análises financeiras detalhadas',
        '💼 Portfólio de investimentos',
        '🔒 Segurança de nível bancário'
      ],
      icon: <FiZap size={80} />,
      color: '#28A745'
    },
    {
      id: 'tech',
      title: 'Tecnologias Utilizadas',
      subtitle: 'Stack moderno e robusto',
      content: [
        '⚛️ React Native + Expo (Mobile)',
        '🌐 React + TypeScript (Web)',
        '🚀 FastAPI + Python (Backend)',
        '🗃️ MongoDB (Database)',
        '🐳 Docker (Containerização)',
        '🎨 Styled Components + Framer Motion'
      ],
      icon: <FiCode size={80} />,
      color: '#17A2B8'
    },
    {
      id: 'architecture',
      title: 'Arquitetura MVC',
      subtitle: 'Organização profissional do código',
      content: [
        '📁 Models: Estruturas de dados e interfaces',
        '🎮 Controllers: Lógica de negócio e APIs',
        '👁️ Views: Componentes de interface',
        '🔄 Estado global com Zustand',
        '📱 Design responsivo para todos dispositivos',
        '🎯 Separação clara de responsabilidades'
      ],
      icon: <FiDatabase size={80} />,
      color: '#FFC700'
    },
    {
      id: 'security',
      title: 'Segurança Avançada',
      subtitle: 'Proteção de dados bancários',
      content: [
        '🔐 Autenticação JWT com tokens seguros',
        '🛡️ Criptografia de senhas com bcrypt',
        '✅ Validação rigorosa de CPF brasileiro',
        '🚫 Proteção contra injeção SQL',
        '🌐 CORS configurado adequadamente',
        '⏱️ Rate limiting para APIs'
      ],
      icon: <FiShield size={80} />,
      color: '#DC3545'
    },
    {
      id: 'demo',
      title: 'Demonstração Interativa',
      subtitle: 'Experimente agora mesmo',
      content: 'Acesse a versão funcional do BankSys e explore todas as funcionalidades implementadas. Use as credenciais de demonstração para uma experiência completa.',
      icon: <FiMonitor size={80} />,
      color: '#6F42C1',
      isDemo: true
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlay) {
      interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, slides.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <PresentationContainer>
      <Header>
        <Logo>
          <FiCreditCard size={32} />
          <span>BankSys</span>
        </Logo>
        <Controls>
          <ControlButton onClick={() => setIsAutoPlay(!isAutoPlay)}>
            <FiPlay size={20} />
            {isAutoPlay ? 'Pausar' : 'Auto Play'}
          </ControlButton>
          <DemoButton href="/login" target="_blank">
            <FiMonitor size={20} />
            Acessar Demo
          </DemoButton>
        </Controls>
      </Header>

      <SlideContainer>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Slide color={slides[currentSlide].color}>
              <SlideContent>
                <IconContainer color={slides[currentSlide].color}>
                  {slides[currentSlide].icon}
                </IconContainer>
                
                <Title>{slides[currentSlide].title}</Title>
                <Subtitle>{slides[currentSlide].subtitle}</Subtitle>
                
                {Array.isArray(slides[currentSlide].content) ? (
                  <FeatureList>
                    {(slides[currentSlide].content as string[]).map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {item}
                      </motion.li>
                    ))}
                  </FeatureList>
                ) : (
                  <Description>{slides[currentSlide].content}</Description>
                )}

                {slides[currentSlide].isDemo && (
                  <DemoActions>
                    <DemoCard href="/login" target="_blank">
                      <FiMonitor size={40} />
                      <div>
                        <h4>Versão Web</h4>
                        <p>Interface completa no navegador</p>
                      </div>
                      <FiArrowRight size={20} />
                    </DemoCard>
                    
                    <DemoCredentials>
                      <h4>Credenciais de Teste:</h4>
                      <p><strong>CPF:</strong> 12345678901</p>
                      <p><strong>Senha:</strong> senha123</p>
                    </DemoCredentials>
                  </DemoActions>
                )}
              </SlideContent>
            </Slide>
          </motion.div>
        </AnimatePresence>
      </SlideContainer>

      <Navigation>
        <NavButton onClick={prevSlide}>←</NavButton>
        
        <SlideIndicators>
          {slides.map((_, index) => (
            <Indicator
              key={index}
              active={index === currentSlide}
              onClick={() => goToSlide(index)}
            />
          ))}
        </SlideIndicators>
        
        <NavButton onClick={nextSlide}>→</NavButton>
      </Navigation>

      <Footer>
        <p>BankSys © 2025 - Desenvolvido para apresentação acadêmica</p>
        <p>Slide {currentSlide + 1} de {slides.length}</p>
      </Footer>
    </PresentationContainer>
  );
};

// Styled Components
const PresentationContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  
  span {
    color: #FFC700;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
`;

const ControlButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const DemoButton = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #FFC700;
  border-radius: 6px;
  color: #000;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: #FFD633;
    transform: translateY(-1px);
  }
`;

const SlideContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Slide = styled.div<{ color: string }>`
  max-width: 1000px;
  width: 100%;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.color};
    border-radius: 20px 20px 0 0;
  }
  
  position: relative;
`;

const SlideContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const IconContainer = styled.div<{ color: string }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
  opacity: 0.9;
`;

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 700px;
  opacity: 0.9;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  width: 100%;
  
  li {
    font-size: 1.1rem;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    border-left: 4px solid #FFC700;
  }
`;

const DemoActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 600px;
`;

const DemoCard = styled.a`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  border: 2px solid #FFC700;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 199, 0, 0.2);
    transform: translateY(-2px);
  }
  
  h4 {
    margin: 0 0 0.25rem 0;
    font-size: 1.2rem;
  }
  
  p {
    margin: 0;
    opacity: 0.8;
  }
`;

const DemoCredentials = styled.div`
  background: rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
  border-radius: 12px;
  text-align: left;
  
  h4 {
    margin: 0 0 1rem 0;
    color: #FFC700;
  }
  
  p {
    margin: 0.5rem 0;
    font-family: 'Courier New', monospace;
  }
`;

const Navigation = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
`;

const NavButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
`;

const SlideIndicators = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Indicator = styled.button<{ active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: ${props => props.active ? '#FFC700' : 'rgba(255, 255, 255, 0.3)'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? '#FFD633' : 'rgba(255, 255, 255, 0.5)'};
  }
`;

const Footer = styled.footer`
  text-align: center;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  p {
    margin: 0.25rem 0;
    opacity: 0.8;
    font-size: 0.9rem;
  }
`;

export default PresentationMode;