#!/bin/bash

echo "=================================="
echo "    Trading Viewer - Linux"
echo "=================================="
echo

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: Please run this script from the trading_viewer directory"
    echo "Usage: cd trading_viewer && ./scripts/run-linux.sh"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "Error: Failed to install dependencies"
        exit 1
    fi
fi

# Build the application if out directory doesn't exist
if [ ! -d "out" ]; then
    echo "Building application..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "Error: Failed to build application"
        exit 1
    fi
fi

echo "Starting Trading Viewer..."
echo

# Set environment variables for better Linux compatibility
export ELECTRON_DISABLE_SANDBOX=1
export ELECTRON_DISABLE_GPU=1
export ELECTRON_DISABLE_SOFTWARE_RASTERIZER=1
export DISPLAY=${DISPLAY:-:0}

# Run the application with additional flags for Linux
npm run electron-dev

echo
echo "Application closed." 