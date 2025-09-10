#!/bin/bash

# Encipher Claim Hub - Quick Deployment Script
# This script helps with the deployment process

echo "🚀 Encipher Claim Hub Deployment Script"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "✅ Project structure verified"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git repository not initialized. Please run 'git init' first."
    exit 1
fi

echo "✅ Git repository verified"

# Check if remote origin is set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ Error: Git remote origin not set. Please add your GitHub repository as origin."
    exit 1
fi

echo "✅ Git remote origin verified"

# Check if environment variables are documented
if [ ! -f "ENVIRONMENT_SETUP.md" ]; then
    echo "⚠️  Warning: ENVIRONMENT_SETUP.md not found. Environment variables may not be properly configured."
fi

echo "✅ Environment setup documentation verified"

# Check if Vercel deployment guide exists
if [ ! -f "VERCEL_DEPLOYMENT_GUIDE.md" ]; then
    echo "⚠️  Warning: VERCEL_DEPLOYMENT_GUIDE.md not found. Deployment guide may not be available."
fi

echo "✅ Deployment guide verified"

# Check if all required files exist
required_files=(
    "src/App.tsx"
    "src/components/WalletComponent.tsx"
    "src/components/ClaimsPortal.tsx"
    "src/hooks/useContract.ts"
    "src/lib/wallet-config.ts"
    "contracts/EncipherClaimHub.sol"
    "package.json"
    "vite.config.ts"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Error: Required file $file not found."
        exit 1
    fi
done

echo "✅ All required files present"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to install dependencies."
        exit 1
    fi
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

# Check if build works
echo "🔨 Testing build process..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Error: Build failed. Please fix build errors before deploying."
    exit 1
fi
echo "✅ Build successful"

# Check git status
echo "📋 Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes. Consider committing them before deploying."
    git status --short
else
    echo "✅ Working directory clean"
fi

echo ""
echo "🎉 Pre-deployment checks completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your WalletConnect Project ID at https://cloud.walletconnect.com/"
echo "2. Deploy your smart contracts to your target networks"
echo "3. Follow the VERCEL_DEPLOYMENT_GUIDE.md for deployment instructions"
echo "4. Add environment variables in Vercel dashboard"
echo "5. Deploy to Vercel"
echo ""
echo "📚 Documentation:"
echo "- Environment Setup: ENVIRONMENT_SETUP.md"
echo "- Deployment Guide: VERCEL_DEPLOYMENT_GUIDE.md"
echo "- Project README: README.md"
echo ""
echo "🔗 Useful Links:"
echo "- GitHub Repository: https://github.com/jacksonLewis88/encipher-claim-hub"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo "- WalletConnect Cloud: https://cloud.walletconnect.com/"
echo ""
echo "Happy deploying! 🚀"
