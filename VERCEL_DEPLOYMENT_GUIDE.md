# Vercel Deployment Guide for Encipher Claim Hub

This guide provides step-by-step instructions for deploying the Encipher Claim Hub to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: The code is already pushed to `https://github.com/jacksonLewis88/encipher-claim-hub`
3. **WalletConnect Project ID**: Get one from [WalletConnect Cloud](https://cloud.walletconnect.com/)

## Step-by-Step Deployment

### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project" or "Add New..." → "Project"
3. Import the GitHub repository:
   - Search for `jacksonLewis88/encipher-claim-hub`
   - Click "Import" next to the repository

### Step 2: Configure Project Settings

1. **Project Name**: `encipher-claim-hub` (or your preferred name)
2. **Framework Preset**: Select "Vite"
3. **Root Directory**: Leave as default (`.`)
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Install Command**: `npm install`

### Step 3: Environment Variables

Add the following environment variables in Vercel dashboard:

#### Required Variables:
```
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

#### Optional Variables (for production):
```
VITE_CONTRACT_ADDRESS_SEPOLIA=0x0000000000000000000000000000000000000000
VITE_CONTRACT_ADDRESS_MAINNET=0x0000000000000000000000000000000000000000
VITE_CONTRACT_ADDRESS_POLYGON=0x0000000000000000000000000000000000000000
VITE_CONTRACT_ADDRESS_ARBITRUM=0x0000000000000000000000000000000000000000
VITE_CONTRACT_ADDRESS_OPTIMISM=0x0000000000000000000000000000000000000000
VITE_FHE_NETWORK_URL=https://api.zama.ai
VITE_FHE_APP_ID=your_fhe_app_id_here
```

#### How to Add Environment Variables:
1. In the Vercel project dashboard, go to "Settings" tab
2. Click "Environment Variables" in the left sidebar
3. Add each variable with:
   - **Name**: The variable name (e.g., `VITE_WALLETCONNECT_PROJECT_ID`)
   - **Value**: The actual value
   - **Environment**: Select "Production", "Preview", and "Development"

### Step 4: Deploy

1. Click "Deploy" button
2. Wait for the build process to complete (usually 2-5 minutes)
3. Once deployed, you'll get a URL like `https://encipher-claim-hub-xxx.vercel.app`

### Step 5: Custom Domain (Optional)

1. In the Vercel project dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow the DNS configuration instructions
4. Wait for SSL certificate to be issued

## Post-Deployment Configuration

### Step 6: Update Contract Addresses

After deploying your smart contracts:

1. Go to Vercel project settings
2. Update the environment variables with actual contract addresses
3. Redeploy the project

### Step 7: Test the Application

1. Visit your deployed URL
2. Test wallet connection functionality
3. Verify that the application loads correctly
4. Test claim submission (if contracts are deployed)

## Important Notes

### Security Considerations:
- Never commit environment variables to the repository
- Use different WalletConnect Project IDs for development and production
- Ensure contract addresses are correct for the target network

### Performance Optimization:
- The application uses Vite for fast builds
- Static assets are optimized automatically by Vercel
- Consider enabling Vercel Analytics for performance monitoring

### Troubleshooting:

#### Common Issues:
1. **Build Fails**: Check that all dependencies are in `package.json`
2. **Environment Variables Not Working**: Ensure they start with `VITE_`
3. **Wallet Connection Issues**: Verify WalletConnect Project ID is correct
4. **Contract Interaction Fails**: Check contract addresses and network configuration

#### Build Logs:
- Check Vercel build logs in the "Functions" tab
- Look for any TypeScript or build errors
- Ensure all imports are correct

## Monitoring and Maintenance

### Analytics:
1. Enable Vercel Analytics in project settings
2. Monitor user interactions and performance
3. Set up alerts for build failures

### Updates:
1. Push changes to the main branch
2. Vercel will automatically redeploy
3. Test the updated application

### Backup:
- Keep the GitHub repository as your source of truth
- Regular commits ensure code is backed up
- Vercel provides automatic backups of deployments

## Support

If you encounter issues:
1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Review build logs in Vercel dashboard
3. Check GitHub repository for any issues
4. Ensure all environment variables are properly set

## Deployment Checklist

- [ ] Vercel account created
- [ ] GitHub repository imported
- [ ] Project settings configured
- [ ] Environment variables added
- [ ] Initial deployment successful
- [ ] Custom domain configured (if needed)
- [ ] Contract addresses updated
- [ ] Application tested
- [ ] Analytics enabled
- [ ] Monitoring set up

## URLs and Resources

- **Repository**: https://github.com/jacksonLewis88/encipher-claim-hub
- **Vercel Dashboard**: https://vercel.com/dashboard
- **WalletConnect Cloud**: https://cloud.walletconnect.com/
- **Vercel Documentation**: https://vercel.com/docs
