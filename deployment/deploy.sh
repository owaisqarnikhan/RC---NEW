#!/bin/bash

# Deployment Script for Rate Card Application
# Run this from your project root on the EC2 instance

set -e

echo "🚀 Starting deployment..."

# Navigate to app directory
cd /var/www/ratecard

# Pull latest code from Git
echo "📥 Pulling latest code from Git..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🏗️ Building the application..."
npm run build

# Push database schema
echo "📊 Pushing database schema..."
npm run db:push

# Stop existing PM2 process if running
echo "🔄 Restarting application..."
pm2 stop ratecard || true
pm2 delete ratecard || true

# Start application with PM2
echo "⚡ Starting application with PM2..."
pm2 start dist/index.js --name ratecard

# Ensure PM2 restarts on server reboot
pm2 startup
pm2 save

echo "✅ Deployment complete!"
echo "🌐 Your application is now live at http://3.23.101.72"

