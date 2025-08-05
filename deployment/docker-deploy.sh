#!/bin/bash

# Docker deployment script
# Run this from your project root on the EC2 instance

set -e

echo "🐳 Starting Docker deployment..."

# Navigate to project directory
cd /var/www/ratecard

# Pull latest code if using Git
if [ -d ".git" ]; then
    echo "📥 Pulling latest code from Git..."
    git pull origin main
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down || true

# Remove old images to free up space
echo "🗑️ Cleaning up old Docker images..."
docker system prune -f

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose up -d --build

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run database migrations
echo "📊 Running database migrations..."
docker-compose exec -T app npm run db:push

echo "✅ Docker deployment complete!"
echo "🌐 Your application is now live at http://3.23.101.72"

# Show container status
echo ""
echo "📋 Container status:"
docker-compose ps
