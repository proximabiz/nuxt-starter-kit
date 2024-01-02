#!/bin/bash

# Check if the OS is Mac or Linux
if [[ "$OSTYPE" != "darwin"* && "$OSTYPE" != "linux"* ]]; then
    echo "This script is intended for Mac or Linux systems only."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node; then
    echo "Node.js is not installed. Please install Node.js before running the application."
    exit 1
fi

# Check if npm is installed
if ! command -v npm; then
    echo "npm is not installed. Please install npm before running the application."
    exit 1
fi

# Check if pnpm is installed, if not, install it
if ! command -v pnpm; then
    echo "pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
fi

# Install dependencies using pnpm
echo "Installing dependencies using pnpm..."
pnpm install

# Check if .env file exists, if not, create it and copy example.env content
if [ ! -f .env ]; then
    echo "Creating .env file and copying example.env content..."
    cp example.env .env
fi

echo "Setup Done"
echo "Now you can start the server using \"pnpm dev\" command"
