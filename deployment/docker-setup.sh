#!/bin/bash

# Docker-based deployment setup for Ubuntu EC2
# Run this script on your Ubuntu EC2 instance

set -e

echo "🐳 Starting Docker-based deployment setup..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
echo "🔧 Installing essential packages..."
sudo apt install -y curl wget git unzip software-properties-common

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
echo "🔧 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Install UFW firewall and configure
echo "🔥 Configuring firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/ratecard
sudo chown -R $USER:$USER /var/www/ratecard

echo "✅ Docker setup completed!"
echo ""
echo "Next steps:"
echo "1. Upload your application files to /var/www/ratecard"
echo "2. Edit docker-compose.yml to set your SESSION_SECRET"
echo "3. Run: docker-compose up -d"
echo ""
echo "⚠️  You may need to log out and back in for Docker group permissions to take effect"
