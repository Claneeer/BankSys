// BankSys Database Initialization Script
print('🏦 Initializing BankSys Banking Database...');

// Switch to BankSys database
db = db.getSiblingDB('banksys');

// Create collections with validation schemas
print('📊 Creating collections with schemas...');

// Users Collection
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['cpf', 'password', 'full_name', 'email', 'phone'],
      properties: {
        cpf: {
          bsonType: 'string',
          pattern: '^[0-9]{11}$',
          description: 'CPF must be 11 digits'
        },
        password: {
          bsonType: 'string',
          minLength: 6,
          description: 'Password must be at least 6 characters'
        },
        full_name: {
          bsonType: 'string',
          minLength: 2,
          description: 'Full name is required'
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          description: 'Must be a valid email address'
        },
        phone: {
          bsonType: 'string',
          description: 'Phone number is required'
        },
        profile_image: {
          bsonType: ['string', 'null'],
          description: 'Base64 encoded profile image'
        },
        created_at: {
          bsonType: 'date',
          description: 'Account creation timestamp'
        },
        updated_at: {
          bsonType: 'date',
          description: 'Last update timestamp'
        },
        is_active: {
          bsonType: 'bool',
          description: 'Account status'
        },
        biometric_enabled: {
          bsonType: 'bool',
          description: 'Biometric authentication status'
        }
      }
    }
  }
});

// Accounts Collection
db.createCollection('accounts', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['user_id', 'account_number', 'account_type', 'balance'],
      properties: {
        user_id: {
          bsonType: 'objectId',
          description: 'Reference to user'
        },
        account_number: {
          bsonType: 'string',
          description: 'Unique account number'
        },
        account_type: {
          enum: ['checking', 'savings'],
          description: 'Account type'
        },
        balance: {
          bsonType: 'number',
          minimum: 0,
          description: 'Current account balance'
        },
        available_balance: {
          bsonType: 'number',
          minimum: 0,
          description: 'Available balance'
        },
        credit_limit: {
          bsonType: ['number', 'null'],
          minimum: 0,
          description: 'Credit limit if applicable'
        }
      }
    }
  }
});

// Transactions Collection
db.createCollection('transactions', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['user_id', 'transaction_type', 'amount', 'description'],
      properties: {
        user_id: {
          bsonType: 'objectId',
          description: 'Reference to user'
        },
        account_id: {
          bsonType: ['objectId', 'null'],
          description: 'Reference to account'
        },
        transaction_type: {
          enum: ['debit', 'credit', 'pix_sent', 'pix_received', 'bill_payment', 'transfer', 'mobile_topup', 'investment', 'loan_payment'],
          description: 'Type of transaction'
        },
        category: {
          enum: ['food', 'transport', 'shopping', 'entertainment', 'bills', 'health', 'education', 'investment', 'transfer', 'other'],
          description: 'Transaction category'
        },
        amount: {
          bsonType: 'number',
          minimum: 0.01,
          description: 'Transaction amount'
        },
        description: {
          bsonType: 'string',
          minLength: 1,
          description: 'Transaction description'
        },
        status: {
          enum: ['pending', 'completed', 'failed'],
          description: 'Transaction status'
        }
      }
    }
  }
});

// Credit Cards Collection
db.createCollection('credit_cards', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['user_id', 'card_number', 'card_name', 'credit_limit'],
      properties: {
        user_id: {
          bsonType: 'objectId',
          description: 'Reference to user'
        },
        card_number: {
          bsonType: 'string',
          description: 'Card number (masked)'
        },
        card_name: {
          bsonType: 'string',
          description: 'Card name/type'
        },
        credit_limit: {
          bsonType: 'number',
          minimum: 0,
          description: 'Credit limit'
        },
        available_limit: {
          bsonType: 'number',
          minimum: 0,
          description: 'Available credit'
        },
        current_balance: {
          bsonType: 'number',
          minimum: 0,
          description: 'Current balance owed'
        }
      }
    }
  }
});

// Investments Collection
db.createCollection('investments', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['user_id', 'investment_type', 'asset_name', 'quantity', 'purchase_price'],
      properties: {
        user_id: {
          bsonType: 'objectId',
          description: 'Reference to user'
        },
        investment_type: {
          enum: ['cryptocurrency', 'cdb', 'stocks', 'mutual_fund'],
          description: 'Type of investment'
        },
        asset_name: {
          bsonType: 'string',
          description: 'Name of the asset'
        },
        quantity: {
          bsonType: 'number',
          minimum: 0,
          description: 'Quantity owned'
        },
        purchase_price: {
          bsonType: 'number',
          minimum: 0,
          description: 'Price at purchase'
        },
        current_price: {
          bsonType: 'number',
          minimum: 0,
          description: 'Current market price'
        }
      }
    }
  }
});

// Create indexes for better performance
print('🔍 Creating database indexes...');

// Users indexes
db.users.createIndex({ 'cpf': 1 }, { unique: true });
db.users.createIndex({ 'email': 1 }, { unique: true });
db.users.createIndex({ 'created_at': -1 });

// Accounts indexes
db.accounts.createIndex({ 'user_id': 1 });
db.accounts.createIndex({ 'account_number': 1 }, { unique: true });

// Transactions indexes
db.transactions.createIndex({ 'user_id': 1, 'transaction_date': -1 });
db.transactions.createIndex({ 'transaction_type': 1 });
db.transactions.createIndex({ 'category': 1 });
db.transactions.createIndex({ 'status': 1 });

// Credit Cards indexes
db.credit_cards.createIndex({ 'user_id': 1 });

// Investments indexes
db.investments.createIndex({ 'user_id': 1 });
db.investments.createIndex({ 'investment_type': 1 });

// Insert sample data
print('📝 Inserting sample banking data...');

// Sample Users (with hashed passwords - in production, use proper bcrypt)
const sampleUsers = [
  {
    _id: ObjectId(),
    cpf: '12345678901',
    password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewkLPsih9K4bL1Hy', // 'senha123'
    full_name: 'Maria Silva Santos',
    email: 'maria.silva@email.com',
    phone: '(11) 99999-1234',
    profile_image: null,
    created_at: new Date(),
    updated_at: new Date(),
    is_active: true,
    biometric_enabled: false
  },
  {
    _id: ObjectId(),
    cpf: '98765432109',
    password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewkLPsih9K4bL1Hy', // 'senha123'
    full_name: 'João Pedro Oliveira',
    email: 'joao.pedro@email.com',
    phone: '(11) 88888-5678',
    profile_image: null,
    created_at: new Date(),
    updated_at: new Date(),
    is_active: true,
    biometric_enabled: true
  },
  {
    _id: ObjectId(),
    cpf: '11122233344',
    password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewkLPsih9K4bL1Hy', // 'senha123'
    full_name: 'Ana Carolina Costa',
    email: 'ana.costa@email.com',
    phone: '(11) 77777-9999',
    profile_image: null,
    created_at: new Date(),
    updated_at: new Date(),
    is_active: true,
    biometric_enabled: false
  }
];

db.users.insertMany(sampleUsers);
print('✅ Sample users created');

// Sample Accounts
const sampleAccounts = [
  {
    _id: ObjectId(),
    user_id: sampleUsers[0]._id,
    account_number: '0001-12345',
    account_type: 'checking',
    balance: 5420.50,
    available_balance: 5420.50,
    credit_limit: null,
    created_at: new Date(),
    updated_at: new Date(),
    is_active: true
  },
  {
    _id: ObjectId(),
    user_id: sampleUsers[1]._id,
    account_number: '0001-67890',
    account_type: 'checking',
    balance: 12350.75,
    available_balance: 12350.75,
    credit_limit: 10000,
    created_at: new Date(),
    updated_at: new Date(),
    is_active: true
  },
  {
    _id: ObjectId(),
    user_id: sampleUsers[2]._id,
    account_number: '0001-11223',
    account_type: 'savings',
    balance: 8900.25,
    available_balance: 8900.25,
    credit_limit: null,
    created_at: new Date(),
    updated_at: new Date(),
    is_active: true
  }
];

db.accounts.insertMany(sampleAccounts);
print('✅ Sample accounts created');

// Sample Credit Cards
const sampleCreditCards = [
  {
    _id: ObjectId(),
    user_id: sampleUsers[0]._id,
    card_number: '**** **** **** 1234',
    card_name: 'BankSys Platinum',
    credit_limit: 5000.00,
    available_limit: 3200.00,
    current_balance: 1800.00,
    due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    minimum_payment: 90.00,
    created_at: new Date(),
    is_active: true
  },
  {
    _id: ObjectId(),
    user_id: sampleUsers[1]._id,
    card_number: '**** **** **** 5678',
    card_name: 'BankSys Gold',
    credit_limit: 8000.00,
    available_limit: 7100.00,
    current_balance: 900.00,
    due_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    minimum_payment: 45.00,
    created_at: new Date(),
    is_active: true
  }
];

db.credit_cards.insertMany(sampleCreditCards);
print('✅ Sample credit cards created');

// Sample Transactions
const sampleTransactions = [
  // Maria's transactions
  {
    _id: ObjectId(),
    user_id: sampleUsers[0]._id,
    account_id: sampleAccounts[0]._id,
    transaction_type: 'debit',
    category: 'food',
    amount: 89.50,
    description: 'Supermercado Extra',
    merchant_name: 'Supermercado Extra',
    transaction_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    created_at: new Date(),
    status: 'completed',
    balance_after: 5420.50
  },
  {
    _id: ObjectId(),
    user_id: sampleUsers[0]._id,
    account_id: sampleAccounts[0]._id,
    transaction_type: 'pix_sent',
    category: 'transfer',
    amount: 200.00,
    description: 'PIX para João',
    recipient_name: 'João Pedro Oliveira',
    pix_key: 'joao.pedro@email.com',
    transaction_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    created_at: new Date(),
    status: 'completed',
    balance_after: 5510.00
  },
  {
    _id: ObjectId(),
    user_id: sampleUsers[0]._id,
    account_id: sampleAccounts[0]._id,
    transaction_type: 'credit',
    category: 'other',
    amount: 3500.00,
    description: 'Salário',
    merchant_name: 'Empresa ABC Ltda',
    transaction_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    created_at: new Date(),
    status: 'completed',
    balance_after: 5710.00
  },
  
  // João's transactions
  {
    _id: ObjectId(),
    user_id: sampleUsers[1]._id,
    account_id: sampleAccounts[1]._id,
    transaction_type: 'pix_received',
    category: 'transfer',
    amount: 200.00,
    description: 'PIX recebido de Maria',
    recipient_name: 'Maria Silva Santos',
    pix_key: 'maria.silva@email.com',
    transaction_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    created_at: new Date(),
    status: 'completed',
    balance_after: 12350.75
  },
  {
    _id: ObjectId(),
    user_id: sampleUsers[1]._id,
    account_id: sampleAccounts[1]._id,
    transaction_type: 'bill_payment',
    category: 'bills',
    amount: 150.00,
    description: 'Conta de luz',
    merchant_name: 'Eletropaulo',
    transaction_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    created_at: new Date(),
    status: 'completed',
    balance_after: 12150.75
  }
];

db.transactions.insertMany(sampleTransactions);
print('✅ Sample transactions created');

// Sample Investments
const sampleInvestments = [
  {
    _id: ObjectId(),
    user_id: sampleUsers[1]._id,
    investment_type: 'cryptocurrency',
    asset_name: 'Bitcoin',
    symbol: 'BTC',
    quantity: 0.05,
    purchase_price: 95000.00,
    current_price: 98500.00,
    total_invested: 4750.00,
    current_value: 4925.00,
    profit_loss: 175.00,
    profit_loss_percentage: 3.68,
    purchase_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    created_at: new Date(),
    updated_at: new Date(),
    is_active: true
  },
  {
    _id: ObjectId(),
    user_id: sampleUsers[1]._id,
    investment_type: 'cdb',
    asset_name: 'CDB Prefixado 100% CDI',
    symbol: null,
    quantity: 1,
    purchase_price: 10000.00,
    current_price: 10125.00,
    total_invested: 10000.00,
    current_value: 10125.00,
    profit_loss: 125.00,
    profit_loss_percentage: 1.25,
    purchase_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
    created_at: new Date(),
    updated_at: new Date(),
    is_active: true,
    maturity_date: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000), // ~10 months from now
    interest_rate: 12.5
  }
];

db.investments.insertMany(sampleInvestments);
print('✅ Sample investments created');

print('🎉 BankSys database initialization completed successfully!');
print('📊 Database Statistics:');
print('   - Users: ' + db.users.countDocuments());
print('   - Accounts: ' + db.accounts.countDocuments());
print('   - Credit Cards: ' + db.credit_cards.countDocuments());
print('   - Transactions: ' + db.transactions.countDocuments());
print('   - Investments: ' + db.investments.countDocuments());
print('🏦 BankSys Banking Database is ready for use!');