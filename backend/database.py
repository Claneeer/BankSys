from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'banksys')]

async def get_database() -> AsyncIOMotorDatabase:
    return db

# Create indexes for better performance
async def create_indexes():
    # User indexes
    await db.users.create_index("cpf", unique=True)
    await db.users.create_index("email", unique=True)
    
    # Transaction indexes
    await db.transactions.create_index([("user_id", 1), ("transaction_date", -1)])
    await db.transactions.create_index("transaction_type")
    await db.transactions.create_index("category")
    
    # Account indexes
    await db.accounts.create_index("user_id")
    await db.accounts.create_index("account_number", unique=True)
    
    # Investment indexes
    await db.investments.create_index("user_id")
    await db.investments.create_index("investment_type")