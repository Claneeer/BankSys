# 🏦 BankSys - Aplicativo Bancário Mobile Completo

Um aplicativo bancário mobile full-stack construído com React Native (Expo), FastAPI e MongoDB, apresentando recursos bancários modernos com integração ao sistema financeiro brasileiro.

## 📱 **Funcionalidades**

### Recursos Bancários Principais
- 🔐 **Autenticação**: Login baseado em CPF com tokens JWT
- 💰 **Gestão de Conta**: Acompanhamento de saldo e histórico de transações
- 💳 **Cartões de Crédito**: Gestão de cartões com acompanhamento de pagamentos
- 📊 **Análises**: Categorização de gastos e insights de despesas
- 💱 **Integração PIX**: Sistema brasileiro de pagamentos instantâneos
- 📋 **Pagamento de Contas**: Pagamentos de serviços públicos e privados
- 📱 **Recarga de Celular**: Crédito para celulares pré-pagos
- 💼 **Investimentos**: Gestão de portfólio de criptomoedas e CDB

### Recursos Técnicos
- 🎨 **UI Moderna**: Design BankSys com esquema de cores 70-20-10
- 📐 **Arquitetura MVC**: Separação limpa de responsabilidades
- 🌐 **Multi-plataforma**: Funciona em iOS, Android e Web
- 🔒 **Segurança**: Autenticação JWT, validação de entrada
- 📊 **Banco de Dados**: MongoDB com schemas e índices apropriados
- 🐳 **Pronto para Docker**: Configuração completa de contêinerização

## 🏗️ **Arquitetura**

```
BankSys/
├── 🔴 Backend (FastAPI + MongoDB)
│   ├── server.py              # Servidor API principal
│   ├── models/               # Modelos de dados
│   ├── controllers/          # Endpoints da API
│   └── database.py           # Conexão com BD
│
├── 📱 Frontend (React Native + Expo)
│   ├── app/
│   │   └── index.tsx         # Ponto de entrada principal
│   ├── src/
│   │   ├── models/           # Interfaces TypeScript
│   │   ├── controllers/      # Lógica de negócio
│   │   └── views/            # Componentes de UI
│   └── package.json
│
├── 🐳 Configuração Docker
│   ├── docker-compose.yml    # Configuração multi-serviço
│   ├── backend/Dockerfile    # Container do backend
│   ├── frontend/Dockerfile   # Container do frontend
│   └── nginx/nginx.conf      # Proxy reverso
│
└── 📊 Banco de Dados
    └── init-mongo.js         # Inicialização do banco
```

## 🚀 **Como Começar**

### Pré-requisitos
- Docker e Docker Compose
- Node.js 18+ (para desenvolvimento)
- Python 3.11+ (para desenvolvimento)

### Início Rápido com Docker

1. **Clonar e Configurar**
   ```bash
   git clone <seu-repositorio>
   cd banksys
   cp .env.example .env
   ```

2. **Iniciar Todos os Serviços**
   ```bash
   docker-compose up -d
   ```

3. **Acessar a Aplicação**
   - 🌐 **Frontend**: http://localhost:3000
   - 🔴 **API Backend**: http://localhost:8001
   - 📊 **Banco de Dados**: mongodb://localhost:27017

### Configuração para Desenvolvimento

1. **Desenvolvimento do Backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # ou `venv\Scripts\activate` no Windows
   pip install -r requirements.txt
   uvicorn server:app --reload --port 8001
   ```

2. **Desenvolvimento do Frontend**
   ```bash
   cd frontend
   yarn install
   yarn start
   ```

3. **Configuração do Banco de Dados**
   ```bash
   docker run -d --name banksys_mongo \
     -p 27017:27017 \
     -e MONGO_INITDB_ROOT_USERNAME=banksys_admin \
     -e MONGO_INITDB_ROOT_PASSWORD=banksys_password_2025 \
     -v ./database/init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js:ro \
     mongo:7.0
   ```

### Script de Configuração Automática
```bash
# Tornar o script executável
chmod +x scripts/setup.sh

# Executar configuração completa
./scripts/setup.sh --full-setup

# Ou usar o menu interativo
./scripts/setup.sh
```

## 📊 **Schema do Banco de Dados**

### Coleções

1. **users** - Contas de usuário e autenticação
   ```javascript
   {
     _id: ObjectId,
     cpf: "12345678901",
     password: "hash_bcrypt",
     full_name: "João Silva",
     email: "joao@email.com",
     phone: "(11) 99999-9999",
     profile_image: "base64_string",
     created_at: Date,
     updated_at: Date,
     is_active: boolean,
     biometric_enabled: boolean
   }
   ```

2. **accounts** - Contas bancárias e saldos
   ```javascript
   {
     _id: ObjectId,
     user_id: ObjectId,
     account_number: "0001-12345",
     account_type: "checking",
     balance: 5420.50,
     available_balance: 5420.50,
     credit_limit: 10000.00
   }
   ```

3. **transactions** - Todas as transações financeiras
   ```javascript
   {
     _id: ObjectId,
     user_id: ObjectId,
     transaction_type: "pix_sent",
     category: "transfer",
     amount: 200.00,
     description: "PIX para João",
     merchant_name: "BankSys",
     transaction_date: Date,
     status: "completed"
   }
   ```

4. **credit_cards** - Informações de cartão de crédito
5. **investments** - Dados do portfólio de investimentos

### Dados de Exemplo
O banco de dados é pré-populado com:
- 3 usuários demo com diferentes perfis
- Múltiplas contas com vários saldos
- Histórico de transações em várias categorias
- Cartões de crédito com diferentes limites
- Portfólios de investimento com crypto e CDB

## 🔐 **Credenciais de Demonstração**

```bash
# Usuário Demo 1
CPF: 12345678901
Senha: senha123
Saldo: R$ 5.420,50

# Usuário Demo 2  
CPF: 98765432109
Senha: senha123
Saldo: R$ 12.350,75

# Usuário Demo 3
CPF: 11122233344
Senha: senha123
Saldo: R$ 8.900,25
```

## 🛠️ **Endpoints da API**

### Autenticação
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login do usuário
- `GET /api/auth/me` - Obter usuário atual

### Contas
- `GET /api/accounts/balance` - Obter saldo da conta
- `GET /api/accounts/credit-cards` - Obter cartões de crédito
- `POST /api/accounts/update-balance` - Atualizar saldo

### Transações
- `GET /api/transactions/` - Listar transações
- `POST /api/transactions/` - Criar transação
- `POST /api/transactions/pix` - Enviar pagamento PIX
- `GET /api/transactions/analytics` - Obter análises
- `POST /api/transactions/seed-data` - Criar dados de exemplo

### Investimentos
- `GET /api/investments/portfolio` - Resumo do portfólio
- `GET /api/investments/` - Listar investimentos
- `POST /api/investments/` - Criar investimento
- `GET /api/investments/cryptocurrencies` - Preços de crypto
- `GET /api/investments/cdb-options` - Opções de CDB

## 🎨 **Sistema de Design**

### Paleta de Cores BankSys (Regra 70-20-10)
- **70% Dominante**: Branco (#FFFFFF) - Fundos principais
- **20% Secundária**: Vermelho (#FF0000) - Marca BankSys
- **10% Destaque**: Amarelo (#FFC700) - CTAs e destaques

### Design Mobile-First
- Layouts responsivos para todos os tamanhos de tela
- Interações amigáveis ao toque (alvos de toque 44px+)
- Componentes de UI específicos da plataforma
- Interfaces conscientes do teclado

## 🔒 **Recursos de Segurança**

- Autenticação baseada em token JWT
- Hash de senhas com bcrypt
- Validação e sanitização de entrada
- Limitação de taxa nos endpoints da API
- Proteção CORS
- Prevenção de injeção SQL
- Cabeçalhos de proteção XSS

## 📱 **Recursos Mobile**

- Compatibilidade multiplataforma (iOS/Android/Web)
- Cache de dados offline
- Notificações push prontas
- Suporte à autenticação biométrica
- Integração com câmera para escaneamento de recibos
- Escaneamento de QR code para pagamentos PIX

## 🐳 **Serviços Docker**

```yaml
Serviços:
├── mongodb     # Banco de Dados (Porta 27017)
├── backend     # API FastAPI (Porta 8001) 
├── frontend    # Expo Web (Porta 3000)
└── nginx       # Proxy Reverso (Porta 80/443)
```

## 🚀 **Implantação**

### Implantação em Produção
```bash
# Construir e implantar
docker-compose -f docker-compose.prod.yml up -d

# Escalar serviços
docker-compose up --scale backend=3 --scale frontend=2
```

### Variáveis de Ambiente
Copie `.env.example` para `.env` e atualize:
- Credenciais do banco de dados
- Chaves secretas JWT
- URLs da API
- Certificados SSL (para HTTPS)

## 🔧 **Desenvolvimento**

### Estrutura do Projeto
```
src/
├── models/           # Modelos de dados (interfaces TypeScript)
├── controllers/      # Lógica de negócio e chamadas API
├── views/           # Componentes de UI e telas
│   ├── components/   # Componentes reutilizáveis
│   └── screens/      # Telas principais do app
└── utils/           # Funções auxiliares
```

### Testes
```bash
# Testes do backend
cd backend
pytest

# Testes do frontend  
cd frontend
yarn test

# Testes de integração
docker-compose -f docker-compose.test.yml up
```

## 📊 **Monitoramento e Análises**

- Monitoramento de performance da aplicação
- Análises de consultas do banco de dados
- Rastreamento de comportamento do usuário
- Log de erros e relatórios
- Monitoramento de transações financeiras
- Log de eventos de segurança

## 🔧 **Comandos Úteis**

```bash
# Ver logs de todos os serviços
docker-compose logs -f

# Reiniciar um serviço específico
docker-compose restart backend

# Entrar no container do banco
docker exec -it banksys_mongodb mongosh

# Backup do banco de dados
docker exec banksys_mongodb mongodump --out /backup

# Ver status dos serviços
docker-compose ps

# Parar todos os serviços
docker-compose down

# Limpar volumes e containers
docker-compose down -v
docker system prune -f
```

## 🛠️ **Solução de Problemas**

### Problemas Comuns

1. **Frontend não carrega**
   ```bash
   # Limpar cache e reiniciar
   docker-compose down
   docker system prune -f
   docker-compose up -d frontend
   ```

2. **Erro de conexão com API**
   ```bash
   # Verificar se o backend está rodando
   curl http://localhost:8001/api/health
   
   # Ver logs do backend
   docker-compose logs backend
   ```

3. **Banco de dados não conecta**
   ```bash
   # Verificar status do MongoDB
   docker exec banksys_mongodb mongosh --eval "db.adminCommand('ping')"
   
   # Reiniciar MongoDB
   docker-compose restart mongodb
   ```

4. **Problemas de permissão**
   ```bash
   # Corrigir permissões
   sudo chown -R $USER:$USER .
   chmod +x scripts/setup.sh
   ```

## 📱 **Testando o Aplicativo**

### No Navegador Web
1. Acesse http://localhost:3000
2. Use as credenciais de demonstração
3. Teste as funcionalidades bancárias

### No Dispositivo Mobile (Expo Go)
1. Instale o Expo Go no seu telefone
2. Escaneie o QR code mostrado no terminal
3. Teste as funcionalidades nativas

### Dados de Teste
```bash
# Criar dados de exemplo via API
curl -X POST http://localhost:8001/api/transactions/seed-data \
  -H "Authorization: Bearer SEU_TOKEN"

# Ou use o botão no app
"Criar dados de exemplo" na tela inicial
```

## 🤝 **Contribuindo**

1. Faça um fork do repositório
2. Crie uma branch de feature
3. Faça suas alterações
4. Adicione testes
5. Submeta um pull request

### Padrões de Código
- Use TypeScript para frontend
- Siga as convenções Python PEP 8 para backend
- Use commits convencionais
- Documente novas funcionalidades

## 📞 **Suporte**

- 📧 **Email**: suporte@banksys.com.br
- 📞 **Telefone**: 0800-BANKSYS (0800-226-5797)
- 💬 **Chat**: Disponível no aplicativo
- 🌐 **Website**: https://banksys.com.br
- 📚 **Documentação**: https://docs.banksys.com.br

## 📄 **Licença**

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

## 🎯 **Roadmap**

### Versão 1.1 (Próxima)
- [ ] Notificações push
- [ ] Autenticação biométrica
- [ ] Scanner de QR Code para PIX
- [ ] Modo escuro
- [ ] Exportação de extratos PDF

### Versão 1.2 (Futuro)
- [ ] Investimentos em ações
- [ ] Empréstimos online
- [ ] Cartão virtual
- [ ] Programa de pontos
- [ ] Assistente virtual com IA

### Versão 2.0 (Longo Prazo)
- [ ] Open Banking
- [ ] Criptomoedas avançadas
- [ ] Marketplace financeiro
- [ ] Gestão empresarial
- [ ] API para desenvolvedores

## 🏆 **Recursos Implementados**

### ✅ Completos
- [x] Sistema de autenticação com CPF
- [x] Gestão de contas e saldos
- [x] Transações e histórico
- [x] Cartões de crédito
- [x] Pagamentos PIX (interface)
- [x] Análises de gastos
- [x] Investimentos básicos
- [x] Docker completo
- [x] API RESTful
- [x] Interface mobile responsiva

### 🚧 Em Desenvolvimento
- [ ] Testes automatizados completos
- [ ] CI/CD pipeline
- [ ] Monitoramento avançado
- [ ] Documentação da API
- [ ] Certificações de segurança

## 🌟 **Destaques Técnicos**

- **Performance**: Interface de 60fps com React Native
- **Segurança**: JWT + bcrypt + validação de entrada
- **Escalabilidade**: Arquitetura de microserviços com Docker
- **Experiência**: Design system brasileiro com acessibilidade
- **Dados**: MongoDB com índices otimizados
- **Deploy**: Um comando para produção completa

---

**BankSys** - Sua solução bancária digital completa 🏦✨

*Desenvolvido com ❤️ para revolucionar o banking brasileiro*