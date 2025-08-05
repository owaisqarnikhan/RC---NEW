#!/bin/bash

# Deployment Script for Rate Card Application
# Run this from your project root on the EC2 instance

set -e

echo "🚀 Starting deployment..."

# Navigate to app directory
cd /var/www/ratecard

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🏗️ Building the application..."
npm run build

# Push database schema
echo " đẩy schema database lên..."
npm run db:push


# Start application with PM2
echo "⚡ Starting application with PM2..."
pm2 start dist/index.js --name ratecard

# Ensure PM2 restarts on server reboot
pm2 startup
pm2 save

echo "✅ Deployment complete!"

