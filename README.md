# 🏦 BankSys - Complete Mobile Banking Application

A full-stack mobile banking application built with React Native (Expo), FastAPI, and MongoDB, featuring modern banking capabilities with Brazilian financial system integration.

## 📱 **Features**

### Core Banking Features
- 🔐 **Authentication**: CPF-based login with JWT tokens
- 💰 **Account Management**: Balance tracking, transaction history
- 💳 **Credit Cards**: Card management with payment tracking
- 📊 **Analytics**: Expense categorization and spending insights
- 💱 **PIX Integration**: Brazilian instant payment system
- 📋 **Bill Payments**: Utility and service payments
- 📱 **Mobile Top-up**: Prepaid phone credit
- 💼 **Investments**: Cryptocurrency and CDB portfolio management

### Technical Features
- 🎨 **Modern UI**: BankSys branding with 70-20-10 color scheme
- 📐 **MVC Architecture**: Clean separation of concerns
- 🌐 **Cross-platform**: Works on iOS, Android, and Web
- 🔒 **Security**: JWT authentication, input validation
- 📊 **Database**: MongoDB with proper schemas and indexes
- 🐳 **Docker Ready**: Complete containerization setup

## 🏗️ **Architecture**

```
BankSys/
├── 🔴 Backend (FastAPI + MongoDB)
│   ├── server.py              # Main API server
│   ├── models/               # Data models
│   ├── controllers/          # API endpoints
│   └── database.py           # DB connection
│
├── 📱 Frontend (React Native + Expo)
│   ├── app/
│   │   └── index.tsx         # Main entry point
│   ├── src/
│   │   ├── models/           # TypeScript interfaces
│   │   ├── controllers/      # Business logic
│   │   └── views/            # UI components
│   └── package.json
│
├── 🐳 Docker Configuration
│   ├── docker-compose.yml    # Multi-service setup
│   ├── backend/Dockerfile    # Backend container
│   ├── frontend/Dockerfile   # Frontend container
│   └── nginx/nginx.conf      # Reverse proxy
│
└── 📊 Database
    └── init-mongo.js         # Database initialization
```

## 🚀 **Getting Started**

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for development)
- Python 3.11+ (for development)

### Quick Start with Docker

1. **Clone and Setup**
   ```bash
   git clone <your-repo>
   cd banksys
   cp .env.example .env
   ```

2. **Start All Services**
   ```bash
   docker-compose up -d
   ```

3. **Access the Application**
   - 🌐 **Frontend**: http://localhost:3000
   - 🔴 **Backend API**: http://localhost:8001
   - 📊 **Database**: mongodb://localhost:27017

### Development Setup

1. **Backend Development**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # or `venv\Scripts\activate` on Windows
   pip install -r requirements.txt
   uvicorn server:app --reload --port 8001
   ```

2. **Frontend Development**
   ```bash
   cd frontend
   yarn install
   yarn start
   ```

3. **Database Setup**
   ```bash
   docker run -d --name banksys_mongo \
     -p 27017:27017 \
     -e MONGO_INITDB_ROOT_USERNAME=banksys_admin \
     -e MONGO_INITDB_ROOT_PASSWORD=banksys_password_2025 \
     -v ./database/init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js:ro \
     mongo:7.0
   ```

## 📊 **Database Schema**

### Collections

1. **users** - User accounts and authentication
2. **accounts** - Bank accounts and balances
3. **transactions** - All financial transactions
4. **credit_cards** - Credit card information
5. **investments** - Investment portfolio data

### Sample Data
The database is pre-populated with:
- 3 demo users with different profiles
- Multiple accounts with various balances
- Transaction history spanning multiple categories
- Credit cards with different limits
- Investment portfolios with crypto and CDB

## 🔐 **Demo Credentials**

```bash
# Demo User 1
CPF: 12345678901
Password: senha123
Balance: R$ 5,420.50

# Demo User 2  
CPF: 98765432109
Password: senha123
Balance: R$ 12,350.75

# Demo User 3
CPF: 11122233344
Password: senha123
Balance: R$ 8,900.25
```

## 🛠️ **API Endpoints**

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Accounts
- `GET /api/accounts/balance` - Get account balance
- `GET /api/accounts/credit-cards` - Get credit cards
- `POST /api/accounts/update-balance` - Update balance

### Transactions
- `GET /api/transactions/` - List transactions
- `POST /api/transactions/` - Create transaction
- `POST /api/transactions/pix` - Send PIX payment
- `GET /api/transactions/analytics` - Get analytics
- `POST /api/transactions/seed-data` - Create sample data

### Investments
- `GET /api/investments/portfolio` - Portfolio summary
- `GET /api/investments/` - List investments
- `POST /api/investments/` - Create investment
- `GET /api/investments/cryptocurrencies` - Crypto prices
- `GET /api/investments/cdb-options` - CDB options

## 🎨 **Design System**

### BankSys Color Palette (70-20-10 Rule)
- **70% Dominant**: White (#FFFFFF) - Main backgrounds
- **20% Secondary**: Red (#FF0000) - BankSys branding
- **10% Accent**: Yellow (#FFC700) - CTAs and highlights

### Mobile-First Design
- Responsive layouts for all screen sizes
- Touch-friendly interactions (44px+ touch targets)
- Platform-specific UI components
- Keyboard-aware interfaces

## 🔒 **Security Features**

- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS protection
- SQL injection prevention
- XSS protection headers

## 📱 **Mobile Features**

- Cross-platform compatibility (iOS/Android/Web)
- Offline data caching
- Push notifications ready
- Biometric authentication support
- Camera integration for receipt scanning
- QR code scanning for PIX payments

## 🐳 **Docker Services**

```yaml
Services:
├── mongodb     # Database (Port 27017)
├── backend     # FastAPI API (Port 8001) 
├── frontend    # Expo Web (Port 3000)
└── nginx       # Reverse Proxy (Port 80/443)
```

## 🚀 **Deployment**

### Production Deployment
```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose up --scale backend=3 --scale frontend=2
```

### Environment Variables
Copy `.env.example` to `.env` and update:
- Database credentials
- JWT secret keys
- API URLs
- SSL certificates (for HTTPS)

## 🔧 **Development**

### Project Structure
```
src/
├── models/           # Data models (TypeScript interfaces)
├── controllers/      # Business logic and API calls
├── views/           # UI components and screens
│   ├── components/   # Reusable components
│   └── screens/      # Main app screens
└── utils/           # Helper functions
```

### Testing
```bash
# Backend tests
cd backend
pytest

# Frontend tests  
cd frontend
yarn test

# Integration tests
docker-compose -f docker-compose.test.yml up
```

## 📊 **Monitoring & Analytics**

- Application performance monitoring
- Database query analytics
- User behavior tracking
- Error logging and reporting
- Financial transaction monitoring
- Security event logging

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see LICENSE file for details.

## 📞 **Support**

- 📧 Email: support@banksys.com.br
- 📞 Phone: 0800-BANKSYS
- 💬 Chat: Available in the app
- 🌐 Website: https://banksys.com.br

---

**BankSys** - Your complete digital banking solution 🏦✨