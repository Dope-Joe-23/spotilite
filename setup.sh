#!/bin/bash

# Spotilite Project Setup Script for macOS/Linux

echo ""
echo "========================================"
echo "Spotilite - Setup Script"
echo "========================================"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install Node.js and npm."
    exit 1
fi

# Check if python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python is not installed. Please install Python 3.10 or higher."
    exit 1
fi

echo "Installing dependencies..."
echo ""

# Install root dependencies
echo "[1/3] Installing root dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error installing root dependencies"
    exit 1
fi

# Install backend dependencies
echo "[2/3] Installing backend dependencies..."
cd backend
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Error installing backend dependencies"
    cd ..
    exit 1
fi

# Install frontend dependencies
echo "[3/3] Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "Error installing frontend dependencies"
    cd ..
    exit 1
fi

cd ..

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Run migrations: npm run migrate"
echo "2. Create admin user: cd backend && python manage.py createsuperuser"
echo "3. Start development: npm run dev"
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:8000"
echo "Admin: http://localhost:8000/admin"
echo ""
