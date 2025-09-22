#!/usr/bin/env python3
"""
BankSys API Testing Suite
Tests all backend API endpoints for the BankSys banking application
"""

import requests
import json
import time
from datetime import datetime
import random

# Configuration
BASE_URL = "https://bankplus-digital.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class BankSysAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.headers = HEADERS.copy()
        self.access_token = None
        self.user_data = None
        self.test_results = []
        
    def log_test(self, test_name, success, message, response_data=None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {test_name}: {message}")
        if response_data and not success:
            print(f"   Response: {response_data}")
    
    def set_auth_header(self, token):
        """Set authorization header for authenticated requests"""
        self.access_token = token
        self.headers["Authorization"] = f"Bearer {token}"
    
    def test_health_check(self):
        """Test GET /api/health"""
        try:
            response = requests.get(f"{self.base_url}/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test("Health Check", True, "API is healthy", data)
                    return True
                else:
                    self.log_test("Health Check", False, "Unexpected health status", data)
                    return False
            else:
                self.log_test("Health Check", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Health Check", False, f"Request failed: {str(e)}")
            return False
    
    def test_user_registration(self):
        """Test POST /api/auth/register"""
        # Generate realistic Brazilian test data
        cpf = f"{random.randint(100, 999)}.{random.randint(100, 999)}.{random.randint(100, 999)}-{random.randint(10, 99)}"
        email = f"teste.usuario{random.randint(1000, 9999)}@email.com"
        phone = f"(11) 9{random.randint(1000, 9999)}-{random.randint(1000, 9999)}"
        
        user_data = {
            "cpf": cpf,
            "password": "MinhaSenh@123",
            "full_name": "João Silva Santos",
            "email": email,
            "phone": phone
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/auth/register",
                json=user_data,
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("cpf") == cpf and data.get("full_name") == user_data["full_name"]:
                    self.user_data = user_data
                    self.log_test("User Registration", True, "User registered successfully", {
                        "user_id": data.get("id"),
                        "cpf": data.get("cpf"),
                        "email": data.get("email")
                    })
                    return True
                else:
                    self.log_test("User Registration", False, "Invalid response data", data)
                    return False
            else:
                self.log_test("User Registration", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("User Registration", False, f"Request failed: {str(e)}")
            return False
    
    def test_user_login(self):
        """Test POST /api/auth/login"""
        if not self.user_data:
            self.log_test("User Login", False, "No user data available for login")
            return False
        
        login_data = {
            "cpf": self.user_data["cpf"],
            "password": self.user_data["password"]
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/auth/login",
                json=login_data,
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("access_token") and data.get("user"):
                    self.set_auth_header(data["access_token"])
                    self.log_test("User Login", True, "Login successful", {
                        "token_type": data.get("token_type"),
                        "user_id": data["user"].get("id")
                    })
                    return True
                else:
                    self.log_test("User Login", False, "Missing access token or user data", data)
                    return False
            else:
                self.log_test("User Login", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("User Login", False, f"Request failed: {str(e)}")
            return False
    
    def test_get_account_balance(self):
        """Test GET /api/accounts/balance"""
        if not self.access_token:
            self.log_test("Get Account Balance", False, "No access token available")
            return False
        
        try:
            response = requests.get(
                f"{self.base_url}/accounts/balance",
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "balance" in data and "available_balance" in data and "account_number" in data:
                    balance = data.get("balance")
                    if balance == 1000.0:
                        self.log_test("Get Account Balance", True, f"Initial balance correct: R${balance}", data)
                        return True
                    else:
                        self.log_test("Get Account Balance", False, f"Unexpected balance: R${balance} (expected R$1000)", data)
                        return False
                else:
                    self.log_test("Get Account Balance", False, "Missing required fields in response", data)
                    return False
            else:
                self.log_test("Get Account Balance", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Get Account Balance", False, f"Request failed: {str(e)}")
            return False
    
    def test_get_credit_cards(self):
        """Test GET /api/accounts/credit-cards"""
        if not self.access_token:
            self.log_test("Get Credit Cards", False, "No access token available")
            return False
        
        try:
            response = requests.get(
                f"{self.base_url}/accounts/credit-cards",
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    card = data[0]
                    required_fields = ["id", "card_number", "card_name", "credit_limit", "available_limit"]
                    if all(field in card for field in required_fields):
                        self.log_test("Get Credit Cards", True, f"Credit card data retrieved: {card['card_name']}", {
                            "card_count": len(data),
                            "card_name": card["card_name"],
                            "credit_limit": card["credit_limit"]
                        })
                        return True
                    else:
                        self.log_test("Get Credit Cards", False, "Missing required fields in card data", data)
                        return False
                else:
                    self.log_test("Get Credit Cards", False, "No credit cards returned or invalid format", data)
                    return False
            else:
                self.log_test("Get Credit Cards", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Get Credit Cards", False, f"Request failed: {str(e)}")
            return False
    
    def test_create_transaction(self, transaction_type="debit", amount=50.0, description="Test transaction"):
        """Test POST /api/transactions/"""
        if not self.access_token:
            self.log_test(f"Create Transaction ({transaction_type})", False, "No access token available")
            return False
        
        transaction_data = {
            "transaction_type": transaction_type,
            "category": "food" if transaction_type == "debit" else "transfer",
            "amount": amount,
            "description": description,
            "merchant_name": "Test Merchant" if transaction_type == "debit" else None,
            "recipient_name": "Maria Silva" if transaction_type in ["pix_sent", "pix_received"] else None
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/transactions/",
                json=transaction_data,
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["id", "transaction_type", "amount", "description", "status", "balance_after"]
                if all(field in data for field in required_fields):
                    self.log_test(f"Create Transaction ({transaction_type})", True, 
                                f"Transaction created: R${amount} - Balance after: R${data['balance_after']}", {
                                    "transaction_id": data["id"],
                                    "amount": data["amount"],
                                    "balance_after": data["balance_after"]
                                })
                    return True
                else:
                    self.log_test(f"Create Transaction ({transaction_type})", False, "Missing required fields", data)
                    return False
            else:
                self.log_test(f"Create Transaction ({transaction_type})", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test(f"Create Transaction ({transaction_type})", False, f"Request failed: {str(e)}")
            return False
    
    def test_get_transactions(self):
        """Test GET /api/transactions/"""
        if not self.access_token:
            self.log_test("Get Transactions", False, "No access token available")
            return False
        
        try:
            response = requests.get(
                f"{self.base_url}/transactions/?limit=10",
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Get Transactions", True, f"Retrieved {len(data)} transactions", {
                        "transaction_count": len(data),
                        "first_transaction": data[0] if data else None
                    })
                    return True
                else:
                    self.log_test("Get Transactions", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Get Transactions", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Get Transactions", False, f"Request failed: {str(e)}")
            return False
    
    def test_seed_transaction_data(self):
        """Test POST /api/transactions/seed-data"""
        if not self.access_token:
            self.log_test("Seed Transaction Data", False, "No access token available")
            return False
        
        try:
            response = requests.post(
                f"{self.base_url}/transactions/seed-data",
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "sample transactions" in data["message"]:
                    self.log_test("Seed Transaction Data", True, data["message"], data)
                    return True
                else:
                    self.log_test("Seed Transaction Data", False, "Unexpected response format", data)
                    return False
            else:
                self.log_test("Seed Transaction Data", False, f"HTTP {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Seed Transaction Data", False, f"Request failed: {str(e)}")
            return False
    
    def test_insufficient_funds(self):
        """Test transaction with insufficient funds"""
        if not self.access_token:
            self.log_test("Insufficient Funds Test", False, "No access token available")
            return False
        
        # Try to create a transaction with amount higher than balance
        transaction_data = {
            "transaction_type": "debit",
            "category": "other",
            "amount": 10000.0,  # Much higher than initial balance
            "description": "Test insufficient funds",
            "merchant_name": "Test Merchant"
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/transactions/",
                json=transaction_data,
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 400:
                data = response.json()
                if "Insufficient funds" in data.get("detail", ""):
                    self.log_test("Insufficient Funds Test", True, "Correctly rejected transaction with insufficient funds", data)
                    return True
                else:
                    self.log_test("Insufficient Funds Test", False, "Wrong error message", data)
                    return False
            else:
                self.log_test("Insufficient Funds Test", False, f"Expected HTTP 400, got {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Insufficient Funds Test", False, f"Request failed: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all API tests in sequence"""
        print("=" * 60)
        print("BankSys API Testing Suite")
        print("=" * 60)
        print(f"Testing API at: {self.base_url}")
        print()
        
        # Test sequence following the requirements
        tests_passed = 0
        total_tests = 0
        
        # 1. Health Check
        total_tests += 1
        if self.test_health_check():
            tests_passed += 1
        
        # 2. User Registration
        total_tests += 1
        if self.test_user_registration():
            tests_passed += 1
        
        # 3. User Login
        total_tests += 1
        if self.test_user_login():
            tests_passed += 1
        
        # 4. Get Account Balance (should be R$1000)
        total_tests += 1
        if self.test_get_account_balance():
            tests_passed += 1
        
        # 5. Get Credit Cards
        total_tests += 1
        if self.test_get_credit_cards():
            tests_passed += 1
        
        # 6. Create sample transaction data
        total_tests += 1
        if self.test_seed_transaction_data():
            tests_passed += 1
        
        # 7. Get transactions after seeding
        total_tests += 1
        if self.test_get_transactions():
            tests_passed += 1
        
        # 8. Test different transaction types
        transaction_types = [
            ("debit", 25.50, "Restaurant payment"),
            ("credit", 100.00, "Refund received"),
            ("pix_sent", 75.00, "PIX payment to friend"),
            ("pix_received", 50.00, "PIX received from family")
        ]
        
        for trans_type, amount, desc in transaction_types:
            total_tests += 1
            if self.test_create_transaction(trans_type, amount, desc):
                tests_passed += 1
        
        # 9. Test insufficient funds
        total_tests += 1
        if self.test_insufficient_funds():
            tests_passed += 1
        
        # 10. Final balance check (should reflect all transactions)
        total_tests += 1
        print("\n--- Final Balance Check ---")
        try:
            response = requests.get(
                f"{self.base_url}/accounts/balance",
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                final_balance = data.get("balance")
                # Expected: 1000 (initial) - 25.5 (debit) + 100 (credit) - 75 (pix_sent) + 50 (pix_received) = 1049.5
                expected_balance = 1049.5
                if abs(final_balance - expected_balance) < 0.01:  # Allow for floating point precision
                    self.log_test("Final Balance Check", True, f"Balance correctly updated to R${final_balance} after all transactions", data)
                    tests_passed += 1
                else:
                    self.log_test("Final Balance Check", False, f"Unexpected final balance: R${final_balance} (expected R${expected_balance})", data)
            else:
                self.log_test("Final Balance Check", False, f"HTTP {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Final Balance Check", False, f"Request failed: {str(e)}")
        
        # Print summary
        print()
        print("=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        print(f"Tests Passed: {tests_passed}/{total_tests}")
        print(f"Success Rate: {(tests_passed/total_tests)*100:.1f}%")
        
        if tests_passed == total_tests:
            print("🎉 ALL TESTS PASSED!")
        else:
            print("⚠️  Some tests failed. Check the details above.")
        
        print()
        print("Failed Tests:")
        for result in self.test_results:
            if not result["success"]:
                print(f"  - {result['test']}: {result['message']}")
        
        return tests_passed == total_tests

if __name__ == "__main__":
    tester = BankSysAPITester()
    success = tester.run_all_tests()
    exit(0 if success else 1)