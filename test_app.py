#!/usr/bin/env python3
"""
Comprehensive test script for the AI Prompt Generator App
Tests both frontend and backend functionality
"""

import requests
import json
import time
import sys

# Configuration
BACKEND_URL = "http://localhost:5000"
FRONTEND_URL = "http://localhost:5173"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_status(message, status="INFO"):
    color = Colors.BLUE
    if status == "SUCCESS":
        color = Colors.GREEN
    elif status == "ERROR":
        color = Colors.RED
    elif status == "WARNING":
        color = Colors.YELLOW
    
    print(f"{color}[{status}]{Colors.END} {message}")

def test_backend_health():
    """Test backend health endpoint"""
    try:
        response = requests.get(f"{BACKEND_URL}/api/health", timeout=5)
        if response.status_code == 200:
            print_status("Backend health check passed", "SUCCESS")
            return True
        else:
            print_status(f"Backend health check failed: {response.status_code}", "ERROR")
            return False
    except Exception as e:
        print_status(f"Backend health check failed: {e}", "ERROR")
        return False

def test_backend_auth():
    """Test backend authentication endpoints"""
    session = requests.Session()
    
    # Test registration
    try:
        register_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123"
        }
        
        response = session.post(f"{BACKEND_URL}/api/auth/register", 
                               json=register_data, timeout=5)
        
        if response.status_code in [201, 409]:  # 409 if user already exists
            print_status("Registration endpoint working", "SUCCESS")
        else:
            print_status(f"Registration failed: {response.status_code}", "ERROR")
            return False
            
    except Exception as e:
        print_status(f"Registration test failed: {e}", "ERROR")
        return False
    
    # Test login
    try:
        login_data = {
            "email": "test@example.com",
            "password": "testpass123"
        }
        
        response = session.post(f"{BACKEND_URL}/api/auth/login", 
                               json=login_data, timeout=5)
        
        if response.status_code == 200:
            print_status("Login endpoint working", "SUCCESS")
            return True
        else:
            print_status(f"Login failed: {response.status_code}", "ERROR")
            return False
            
    except Exception as e:
        print_status(f"Login test failed: {e}", "ERROR")
        return False

def test_backend_prompt_generation():
    """Test prompt generation endpoint"""
    try:
        prompt_data = {
            "user_input": "Create a website for a bakery",
            "target_tool": "chatgpt",
            "prompt_style": "creative"
        }
        
        response = requests.post(f"{BACKEND_URL}/api/generate-prompt", 
                               json=prompt_data, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and data.get('prompt'):
                print_status("Prompt generation endpoint working", "SUCCESS")
                return True
            else:
                print_status("Prompt generation returned invalid data", "ERROR")
                return False
        else:
            print_status(f"Prompt generation failed: {response.status_code}", "ERROR")
            return False
            
    except Exception as e:
        print_status(f"Prompt generation test failed: {e}", "ERROR")
        return False

def test_frontend_accessibility():
    """Test if frontend is accessible"""
    try:
        response = requests.get(FRONTEND_URL, timeout=5)
        if response.status_code == 200:
            print_status("Frontend is accessible", "SUCCESS")
            return True
        else:
            print_status(f"Frontend not accessible: {response.status_code}", "ERROR")
            return False
    except Exception as e:
        print_status(f"Frontend accessibility test failed: {e}", "ERROR")
        return False

def run_all_tests():
    """Run all tests"""
    print_status("Starting AI Prompt Generator App Tests", "INFO")
    print("=" * 50)
    
    tests = [
        ("Backend Health", test_backend_health),
        ("Backend Authentication", test_backend_auth),
        ("Prompt Generation", test_backend_prompt_generation),
        ("Frontend Accessibility", test_frontend_accessibility),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print_status(f"Running {test_name} test...", "INFO")
        if test_func():
            passed += 1
        print()
    
    print("=" * 50)
    print_status(f"Tests completed: {passed}/{total} passed", 
                "SUCCESS" if passed == total else "WARNING")
    
    if passed == total:
        print_status("All tests passed! The application is working correctly.", "SUCCESS")
    else:
        print_status("Some tests failed. Please check the logs above.", "WARNING")
    
    return passed == total

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
