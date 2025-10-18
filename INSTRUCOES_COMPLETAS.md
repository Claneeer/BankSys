# 🚀 INSTRUÇÕES COMPLETAS - BANKSYS

## 📋 **RESUMO DO PROJETO**

✅ **BankSys Mobile Banking App COMPLETO:**
- ✅ Backend FastAPI com todas as APIs bancárias funcionais
- ✅ Frontend React Native com MVC e design BankSys 
- ✅ Banco MongoDB com schemas e dados de exemplo
- ✅ Docker completo para produção
- ✅ Documentação em português

---

## 🐳 **COMO EXECUTAR COM DOCKER (RECOMENDADO)**

### 1. Preparação Inicial
```bash
# No diretório /app, execute:
cd /app

# Dar permissão ao script
chmod +x scripts/setup.sh
```

### 2. Configuração Automática (Mais Fácil)
```bash
# Executa setup completo automaticamente
./scripts/setup.sh --full-setup
```

### 3. Configuração Manual
```bash
# 1. Copiar variáveis de ambiente
cp .env.example .env

# 2. Subir todos os serviços
docker-compose up -d

# 3. Verificar se tudo está funcionando
docker-compose ps
```

### 4. Acessar a Aplicação
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **Documentação API**: http://localhost:8001/docs
- **MongoDB**: mongodb://localhost:27017

---

## 💻 **COMO EXECUTAR SEM DOCKER (DESENVOLVIMENTO)**

### 1. Backend (Terminal 1)
```bash
cd backend

# Instalar dependências Python
pip install fastapi uvicorn pymongo motor python-jose[cryptography] passlib[bcrypt] python-multipart

# Executar servidor
python server.py
# Ou: uvicorn server:app --reload --port 8001
```

### 2. Frontend (Terminal 2)
```bash
cd frontend

# Instalar dependências Node.js
yarn install

# Executar app
yarn start
# Acesse: http://localhost:3000
```

### 3. MongoDB (Terminal 3)
```bash
# Opção 1: Docker só para MongoDB
docker run -d --name banksys_mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=banksys_admin \
  -e MONGO_INITDB_ROOT_PASSWORD=banksys_password_2025 \
  mongo:7.0

# Opção 2: MongoDB local (se já instalado)
mongod --dbpath /data/db
```

---

## 📊 **BANCO DE DADOS**

### Inicialização Automática
O arquivo `/app/database/init-mongo.js` contém:
- ✅ Schemas de todas as coleções
- ✅ Índices para performance
- ✅ 3 usuários de exemplo
- ✅ Contas com saldos
- ✅ Transações de exemplo
- ✅ Cartões de crédito
- ✅ Investimentos

### Conectar Manualmente
```bash
# Via Docker
docker exec -it banksys_mongodb mongosh

# Via MongoDB local
mongosh banksys
```

### Dados de Teste
```javascript
// Usuários criados automaticamente:
{
  cpf: "12345678901",
  senha: "senha123",
  nome: "Maria Silva Santos",
  saldo: "R$ 5.420,50"
}

{
  cpf: "98765432109", 
  senha: "senha123",
  nome: "João Pedro Oliveira",
  saldo: "R$ 12.350,75"
}

{
  cpf: "11122233344",
  senha: "senha123", 
  nome: "Ana Carolina Costa",
  saldo: "R$ 8.900,25"
}
```

---

## 🧪 **TESTANDO A APLICAÇÃO**

### 1. Teste Rápido das APIs
```bash
# Verificar saúde do backend
curl http://localhost:8001/api/health

# Registrar usuário
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "cpf": "12345678900",
    "password": "teste123", 
    "full_name": "Teste User",
    "email": "teste@banksys.com",
    "phone": "(11) 99999-9999"
  }'

# Fazer login
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "cpf": "12345678900",
    "password": "teste123"
  }'
```

### 2. Teste do Frontend
1. Acesse http://localhost:3000
2. Use CPF: `12345678901` e senha: `senha123`
3. Navegue pelas telas:
   - 🏠 **Home**: Saldo, cartões, ações rápidas
   - 📊 **Extrato**: Transações e análises
   - 💼 **Investimentos**: Portfólio e opções
   - ⚙️ **Configurações**: Perfil e opções

### 3. Criar Dados de Exemplo
```bash
# Via API (com token de autenticação)
curl -X POST http://localhost:8001/api/transactions/seed-data \
  -H "Authorization: Bearer SEU_TOKEN"

# Ou pelo botão no app
Clique em "Criar dados de exemplo" na tela inicial
```

---

## 🔧 **COMANDOS ÚTEIS**

### Docker
```bash
# Ver logs
docker-compose logs -f

# Parar tudo
docker-compose down

# Reiniciar serviço
docker-compose restart backend

# Limpar tudo
docker-compose down -v
docker system prune -f
```

### Desenvolvimento
```bash
# Backend - instalar nova dependência
pip install nova-lib
pip freeze > requirements.txt

# Frontend - instalar nova dependência  
yarn add nova-lib

# Ver logs do Expo
yarn start --clear-cache
```

### MongoDB
```bash
# Backup
docker exec banksys_mongodb mongodump --out /backup

# Restore
docker exec banksys_mongodb mongorestore /backup

# Ver coleções
docker exec -it banksys_mongodb mongosh banksys --eval "show collections"
```

---

## 🎯 **ESTRUTURA COMPLETA CRIADA**

### Backend (FastAPI + MongoDB)
```
backend/
├── server.py                 # ✅ API completa consolidada
├── controllers/              # ✅ MVC Controllers
│   ├── auth_controller.py   # ✅ Autenticação JWT
│   ├── account_controller.py # ✅ Contas e cartões
│   ├── transaction_controller.py # ✅ Transações e PIX
│   └── investment_controller.py # ✅ Investimentos
├── models/                  # ✅ MVC Models
│   ├── user.py             # ✅ Usuários
│   ├── account.py          # ✅ Contas bancárias
│   ├── transaction.py      # ✅ Transações
│   └── investment.py       # ✅ Investimentos
├── database.py             # ✅ Conexão MongoDB
├── requirements.txt        # ✅ Dependências Python
└── Dockerfile             # ✅ Container backend
```

### Frontend (React Native + Expo)
```
frontend/
├── app/
│   └── index.tsx           # ✅ Entry point com login
├── src/
│   ├── models/             # ✅ MVC Models (TypeScript)
│   │   ├── User.ts        # ✅ Interfaces usuário
│   │   ├── Account.ts     # ✅ Interfaces conta
│   │   ├── Transaction.ts # ✅ Interfaces transação
│   │   └── Investment.ts  # ✅ Interfaces investimento
│   ├── controllers/        # ✅ MVC Controllers
│   │   ├── AuthController.ts # ✅ Lógica autenticação
│   │   ├── AccountController.ts # ✅ Lógica contas
│   │   ├── TransactionController.ts # ✅ Lógica transações
│   │   └── AppStore.ts    # ✅ Zustand state
│   └── views/             # ✅ MVC Views
│       ├── components/    # ✅ Componentes
│       │   ├── BankSysColors.ts # ✅ Design system
│       │   └── MainApp.tsx # ✅ Navegação principal
│       └── screens/       # ✅ Telas principais
│           ├── LoginScreen.tsx # ✅ Login CPF/senha
│           ├── HomeScreen.tsx # ✅ Dashboard principal
│           ├── TransactionsScreen.tsx # ✅ Extrato e análises
│           ├── InvestmentsScreen.tsx # ✅ Investimentos
│           └── SettingsScreen.tsx # ✅ Configurações
├── package.json           # ✅ Dependências React Native
└── Dockerfile            # ✅ Container frontend
```

### Docker & DevOps
```
├── docker-compose.yml     # ✅ Multi-container setup
├── nginx/
│   └── nginx.conf        # ✅ Reverse proxy
├── database/
│   └── init-mongo.js     # ✅ Inicialização MongoDB
├── scripts/
│   └── setup.sh         # ✅ Script setup automático
├── .env.example         # ✅ Variáveis ambiente
├── .dockerignore        # ✅ Docker ignore
├── README.md            # ✅ Documentação inglês
└── README_PT.md         # ✅ Documentação português
```

---

## 🎨 **RECURSOS IMPLEMENTADOS**

### ✅ Funcionalidades Bancárias
- [x] Login com CPF brasileiro e validação
- [x] Dashboard com saldo e cartão de crédito
- [x] Histórico completo de transações
- [x] Categorização automática de gastos
- [x] Análises financeiras com gráficos
- [x] Sistema PIX (interface)
- [x] Pagamento de contas
- [x] Recarga de celular
- [x] Portfólio de investimentos
- [x] Opções de CDB e criptomoedas

### ✅ Tecnologias
- [x] React Native com Expo (cross-platform)
- [x] FastAPI com async/await
- [x] MongoDB com schemas validados
- [x] Arquitetura MVC completa
- [x] JWT para autenticação segura
- [x] Docker para containerização
- [x] Nginx como reverse proxy
- [x] Design system BankSys (70-20-10)

### ✅ Segurança
- [x] Hash de senhas com bcrypt
- [x] Validação de CPF brasileiro
- [x] Tokens JWT com expiração
- [x] Validação de entrada de dados
- [x] Prevenção de injeção SQL
- [x] CORS configurado
- [x] Rate limiting por IP

---

## 🚀 **COMO USAR**

1. **Execute o setup**: `./scripts/setup.sh --full-setup`
2. **Acesse o app**: http://localhost:3000
3. **Faça login** com CPF: `12345678901` e senha: `senha123`
4. **Explore as funcionalidades**:
   - Veja seu saldo e cartão
   - Crie dados de exemplo
   - Navegue pelas transações
   - Explore investimentos
   - Teste as configurações

---

## 🆘 **SUPORTE E PROBLEMAS**

### Problemas Comuns

**1. Frontend não carrega**
```bash
# Limpar cache
docker-compose down
docker system prune -f
./scripts/setup.sh --start
```

**2. API não responde**
```bash
# Verificar backend
curl http://localhost:8001/api/health
docker-compose logs backend
```

**3. MongoDB não conecta**
```bash
# Verificar MongoDB
docker exec banksys_mongodb mongosh --eval "db.adminCommand('ping')"
docker-compose restart mongodb
```

**4. Login não funciona**
- Verifique se usou CPF: `12345678901` e senha: `senha123`
- Ou registre novo usuário via API primeiro

### Logs Importantes
```bash
# Ver todos os logs
docker-compose logs -f

# Log específico
docker-compose logs frontend
docker-compose logs backend  
docker-compose logs mongodb
```

---

## 🎉 **PROJETO COMPLETO!**

O **BankSys** está 100% funcional com:

✅ **Aplicação móvel completa**
✅ **APIs bancárias funcionais**  
✅ **Banco de dados estruturado**
✅ **Docker para produção**
✅ **Documentação completa**

**Para usar agora:**
```bash
cd /app
./scripts/setup.sh --full-setup
# Acesse: http://localhost:3000
# Login: CPF 12345678901, senha: senha123
```

---

**BankSys - Seu banco digital completo! 🏦✨**