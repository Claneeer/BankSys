#!/bin/bash
# BankSys Complete Setup Script

set -e

echo "🏦 BankSys Mobile Banking Application Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Docker is installed
check_docker() {
    echo -e "${BLUE}Checking Docker installation...${NC}"
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
        echo "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}Docker Compose is not installed. Please install Docker Compose first.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"
}

# Setup environment variables
setup_env() {
    echo -e "${BLUE}Setting up environment variables...${NC}"
    
    if [ ! -f .env ]; then
        echo -e "${YELLOW}Creating .env file from template...${NC}"
        cp .env.example .env
        echo -e "${GREEN}✅ .env file created${NC}"
        echo -e "${YELLOW}📝 Please review and update .env file with your settings${NC}"
    else
        echo -e "${GREEN}✅ .env file already exists${NC}"
    fi
}

# Build Docker images
build_images() {
    echo -e "${BLUE}Building Docker images...${NC}"
    
    echo -e "${YELLOW}Building backend image...${NC}"
    docker build -t banksys-backend ./backend
    
    echo -e "${YELLOW}Building frontend image...${NC}"
    docker build -t banksys-frontend ./frontend
    
    echo -e "${GREEN}✅ Docker images built successfully${NC}"
}

# Start services
start_services() {
    echo -e "${BLUE}Starting BankSys services...${NC}"
    
    # Start MongoDB first
    echo -e "${YELLOW}Starting MongoDB...${NC}"
    docker-compose up -d mongodb
    
    # Wait for MongoDB to be ready
    echo -e "${YELLOW}Waiting for MongoDB to be ready...${NC}"
    sleep 10
    
    # Start backend
    echo -e "${YELLOW}Starting backend API...${NC}"
    docker-compose up -d backend
    
    # Wait for backend to be ready
    echo -e "${YELLOW}Waiting for backend to be ready...${NC}"
    sleep 5
    
    # Start frontend
    echo -e "${YELLOW}Starting frontend...${NC}"
    docker-compose up -d frontend
    
    # Start nginx
    echo -e "${YELLOW}Starting Nginx reverse proxy...${NC}"
    docker-compose up -d nginx
    
    echo -e "${GREEN}✅ All services started successfully${NC}"
}

# Check service health
check_health() {
    echo -e "${BLUE}Checking service health...${NC}"
    
    # Check backend health
    echo -e "${YELLOW}Checking backend API...${NC}"
    for i in {1..10}; do
        if curl -f http://localhost:8001/api/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Backend API is healthy${NC}"
            break
        else
            echo -e "${YELLOW}⏳ Waiting for backend API... (${i}/10)${NC}"
            sleep 3
        fi
        
        if [ $i -eq 10 ]; then
            echo -e "${RED}❌ Backend API failed to start${NC}"
            return 1
        fi
    done
    
    # Check frontend
    echo -e "${YELLOW}Checking frontend...${NC}"
    for i in {1..10}; do
        if curl -f http://localhost:3000 > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Frontend is healthy${NC}"
            break
        else
            echo -e "${YELLOW}⏳ Waiting for frontend... (${i}/10)${NC}"
            sleep 3
        fi
        
        if [ $i -eq 10 ]; then
            echo -e "${RED}❌ Frontend failed to start${NC}"
            return 1
        fi
    done
    
    # Check database
    echo -e "${YELLOW}Checking database connection...${NC}"
    if docker exec banksys_mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Database is healthy${NC}"
    else
        echo -e "${RED}❌ Database connection failed${NC}"
        return 1
    fi
}

# Show service status
show_status() {
    echo -e "${BLUE}Service Status:${NC}"
    docker-compose ps
    
    echo -e "\n${BLUE}Service URLs:${NC}"
    echo -e "${GREEN}🌐 Frontend:${NC} http://localhost:3000"
    echo -e "${GREEN}🔴 Backend API:${NC} http://localhost:8001"
    echo -e "${GREEN}📊 API Documentation:${NC} http://localhost:8001/docs"
    echo -e "${GREEN}📊 Database:${NC} mongodb://localhost:27017"
    
    echo -e "\n${BLUE}Demo Credentials:${NC}"
    echo -e "${YELLOW}CPF:${NC} 12345678901"
    echo -e "${YELLOW}Password:${NC} senha123"
    
    echo -e "\n${GREEN}🎉 BankSys is ready to use!${NC}"
}

# Cleanup function
cleanup() {
    echo -e "${BLUE}Cleaning up Docker resources...${NC}"
    docker-compose down -v
    docker system prune -f
    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

# Stop services
stop_services() {
    echo -e "${BLUE}Stopping BankSys services...${NC}"
    docker-compose down
    echo -e "${GREEN}✅ Services stopped${NC}"
}

# Main menu
show_menu() {
    echo -e "\n${BLUE}BankSys Setup Menu:${NC}"
    echo "1. Full setup (recommended for first time)"
    echo "2. Start services"
    echo "3. Stop services"
    echo "4. Check status"
    echo "5. View logs"
    echo "6. Cleanup"
    echo "7. Exit"
    echo -n "Choose an option [1-7]: "
}

# Handle user choice
handle_choice() {
    local choice=$1
    case $choice in
        1)
            check_docker
            setup_env
            build_images
            start_services
            check_health
            show_status
            ;;
        2)
            start_services
            check_health
            show_status
            ;;
        3)
            stop_services
            ;;
        4)
            show_status
            ;;
        5)
            echo -e "${BLUE}Showing logs (Ctrl+C to exit):${NC}"
            docker-compose logs -f
            ;;
        6)
            cleanup
            ;;
        7)
            echo -e "${GREEN}Goodbye! 👋${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option. Please choose 1-7.${NC}"
            ;;
    esac
}

# Main execution
main() {
    while true; do
        show_menu
        read -r choice
        handle_choice "$choice"
        echo -e "\nPress any key to continue..."
        read -n 1
        clear
    done
}

# Check if running with arguments
if [ $# -eq 0 ]; then
    clear
    main
else
    case $1 in
        --full-setup)
            check_docker
            setup_env
            build_images
            start_services
            check_health
            show_status
            ;;
        --start)
            start_services
            ;;
        --stop)
            stop_services
            ;;
        --status)
            show_status
            ;;
        --cleanup)
            cleanup
            ;;
        --help)
            echo "BankSys Setup Script"
            echo "Usage: $0 [--full-setup|--start|--stop|--status|--cleanup|--help]"
            echo ""
            echo "Options:"
            echo "  --full-setup    Complete setup including build and start"
            echo "  --start         Start all services"
            echo "  --stop          Stop all services"
            echo "  --status        Show service status"
            echo "  --cleanup       Clean up Docker resources"
            echo "  --help          Show this help message"
            ;;
        *)
            echo "Invalid option. Use --help for usage information."
            exit 1
            ;;
    esac
fi