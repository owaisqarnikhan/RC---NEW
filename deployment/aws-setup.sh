#!/bin/bash

# AWS EC2 Ubuntu Server Setup Script for Rate Card Application
# Run this script on your Ubuntu EC2 instance

set -e

echo "🚀 Starting AWS EC2 Ubuntu Server Setup..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
echo "🔧 Installing essential packages..."
sudo apt install -y curl wget git unzip software-properties-common build-essential

# Install Node.js (LTS version)
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js installation
echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install PostgreSQL
echo "🐘 Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
echo "🔐 Setting up PostgreSQL database..."
sudo -u postgres psql -c "CREATE DATABASE ratecard_bayg;"
sudo -u postgres psql -c "CREATE USER bayg_user WITH PASSWORD 'bayg123';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ratecard_bayg TO bayg_user;"
sudo -u postgres psql -c "ALTER USER bayg_user CREATEDB;"

# Install Nginx
echo "🌐 Installing Nginx..."
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Install PM2 (Process Manager)
echo "⚡ Installing PM2..."
sudo npm install -g pm2

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/ratecard
sudo chown -R $USER:$USER /var/www/ratecard

# Install UFW firewall and configure
echo "🔥 Configuring firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 5000

echo "✅ Basic server setup completed!"
echo ""
echo "Next steps:"
echo "1. Upload your application files to /var/www/ratecard"
echo "2. Run the deployment script"
echo "3. Configure Nginx"
echo ""
