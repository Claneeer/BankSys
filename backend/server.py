from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path

# Import controllers
from controllers.auth_controller import router as auth_router
from controllers.account_controller import router as account_router
from controllers.transaction_controller import router as transaction_router
from controllers.investment_controller import router as investment_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app without a prefix
app = FastAPI(title="BankSys API", description="Mobile Banking Application API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Root endpoint
@api_router.get("/")
async def root():
    return {"message": "BankSys API - Mobile Banking Application", "version": "1.0.0"}

# Health check endpoint
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "banksys-api"}

# Include all routers
api_router.include_router(auth_router)
api_router.include_router(account_router)
api_router.include_router(transaction_router)
api_router.include_router(investment_router)

# Include the main API router in the app
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Database connection lifecycle
@app.on_event("startup")
async def startup_event():
    """Initialize database indexes on startup"""
    try:
        from database import create_indexes
        await create_indexes()
        logger.info("Database indexes created successfully")
    except Exception as e:
        logger.error(f"Failed to create database indexes: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up resources on shutdown"""
    try:
        from database import client
        client.close()
        logger.info("Database connection closed")
    except Exception as e:
        logger.error(f"Error closing database connection: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8001, reload=True)