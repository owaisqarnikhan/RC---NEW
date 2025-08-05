#!/bin/bash

# Initial Git-based deployment setup script
# Run this on your EC2 instance after running aws-setup.sh

set -e

echo "🚀 Setting up Git-based deployment..."

# Ask for Git repository URL
echo "📋 Please provide your Git repository URL:"
echo "Example: https://github.com/yourusername/your-repo.git"
read -p "Git Repository URL: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ Repository URL is required!"
    exit 1
fi

# Clone the repository
echo "📥 Cloning repository..."
sudo rm -rf /var/www/ratecard
sudo mkdir -p /var/www
cd /var/www
sudo git clone "$REPO_URL" ratecard
sudo chown -R $USER:$USER /var/www/ratecard

# Navigate to project directory
cd /var/www/ratecard

# Create production environment file
echo "🔧 Setting up environment configuration..."
cp deployment/.env.production .env

echo "⚠️  IMPORTANT: You need to edit the .env file with your production settings!"
echo "Run: nano .env"
echo ""
echo "Make sure to update:"
echo "- SESSION_SECRET (use a secure random string)"
echo "- SMTP settings (if you need email functionality)"
echo ""
echo "After editing .env, run the deployment script:"
echo "bash deployment/deploy.sh"
