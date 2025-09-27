# RIF Relay Setup Guide for BlockBundlR

This guide will help you set up a complete RIF Relay integration with real gas-less transactions using RIF tokens.

## 🎯 Overview

RIF Relay allows users to pay transaction fees using RIF tokens instead of rBTC, enabling gas-less transactions through smart wallets.

## 🚀 Quick Start

### 1. Set Up RIF Relay Server

```bash
# Run the setup script
node scripts/setup-rif-relay-server.js

# Navigate to the server directory
cd rif-relay-server

# Set your relay worker private key (REQUIRED)
export RELAY_WORKER_PRIVATE_KEY=0x...

# Start the server
./start-server.sh
```

### 2. Update Your Application

Replace the simplified RIF client with the real one:

```typescript
// In your components
import { RealRIFRelayClient } from '../lib/real-rif-relay-client';
import RealRIFRelayIntegration from '../components/RealRIFRelayIntegration';

// Use the real client
const [rifClient] = useState(() => new RealRIFRelayClient());
```

### 3. Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000/rif-test`
3. Connect your wallet to Rootstock Testnet
4. Deploy smart wallet
5. Approve RIF tokens
6. Test gas-less transactions

## 🔧 Detailed Setup

### Prerequisites

- Node.js 16+
- Git
- Rootstock Testnet RIF tokens
- Private key for relay worker account

### Step 1: RIF Relay Server

The RIF Relay server handles incoming transaction requests and forwards them to the blockchain.

#### Manual Setup

```bash
# Clone the RIF Relay repository
git clone https://github.com/rsksmart/rif-relay.git
cd rif-relay

# Install dependencies
npm install

# Configure the server
cp .env.example .env
# Edit .env with your configuration
```

#### Configuration

Create a `.env` file with:

```env
# Network Configuration
RPC_URL=https://public-node.testnet.rsk.co
CHAIN_ID=31
NETWORK_NAME=Rootstock Testnet

# Server Configuration
RELAY_SERVER_PORT=8090
RELAY_SERVER_HOST=localhost

# Relay Worker Account (REQUIRED)
RELAY_WORKER_PRIVATE_KEY=0x...

# Gas Configuration
GAS_PRICE=1000000000
MAX_GAS_LIMIT=10000000

# Contract Addresses
RELAY_HUB_ADDRESS=0xAd525463961399793f8716b0D85133ff7503a7C2
SMART_WALLET_FACTORY_ADDRESS=0xCBc3BC24da96Ef5606d3801E13E1DC6E98C5c877
RIF_TOKEN_ADDRESS=0x19F64674D8A5B4E652319F5e239eFd3bc969A1fE
```

### Step 2: Smart Wallet Factory

The Smart Wallet Factory deploys smart wallets for users.

#### Deploy Smart Wallet Factory

```bash
# Using Hardhat
npx hardhat run scripts/deploy-smart-wallet-factory.js --network rootstock-testnet

# Using Remix
# 1. Open Remix IDE
# 2. Connect to Rootstock Testnet
# 3. Deploy SmartWalletFactory contract
# 4. Note the deployed address
```

### Step 3: RIF Token Configuration

Ensure the RIF token is properly configured:

```typescript
// RIF Token on Rootstock Testnet
const RIF_TOKEN_ADDRESS = '0x19F64674D8A5B4E652319F5e239eFd3bc969A1fE';
const RIF_TOKEN_SYMBOL = 'tRIF';
const RIF_TOKEN_DECIMALS = 18;
```

### Step 4: Client Integration

#### Basic Integration

```typescript
import { RealRIFRelayClient } from './lib/real-rif-relay-client';

const rifClient = new RealRIFRelayClient('http://localhost:8090');

// Initialize with wallet
rifClient.setWalletClient(walletClient, userAddress);

// Deploy smart wallet
await rifClient.deploySmartWallet(userAddress, rifTokenAmount);

// Execute gas-less transaction
await rifClient.executeBatch(userAddress, transactions, rifTokenAmount);
```

#### Advanced Integration

```typescript
// Check server status
const isOnline = await rifClient.checkRelayServerStatus();

// Get smart wallet info
const smartWallet = await rifClient.getSmartWallet(userAddress);

// Check token status
const tokenStatus = await rifClient.checkTokenStatus(userAddress, batchSize);

// Execute batch transfer
await rifClient.batchTransfer(userAddress, recipients, amounts, rifTokenAmount);
```

## 🧪 Testing

### Test Scenarios

1. **Server Connection**
   - Check if RIF Relay server is running
   - Verify server health endpoint

2. **Smart Wallet Deployment**
   - Deploy smart wallet for user
   - Verify deployment on blockchain

3. **Token Approval**
   - Approve RIF tokens for smart wallet
   - Check allowance on blockchain

4. **Gas-less Transactions**
   - Execute batch transactions
   - Verify RIF token payments
   - Check transaction success

### Test Commands

```bash
# Test server health
curl http://localhost:8090/health

# Test relay request
curl -X POST http://localhost:8090/relay \
  -H "Content-Type: application/json" \
  -d '{"from":"0x...","to":"0x...","data":"0x...","gas":"21000"}'
```

## 🔍 Troubleshooting

### Common Issues

1. **Server Not Starting**
   - Check if port 8090 is available
   - Verify private key is set
   - Check RPC connection

2. **Smart Wallet Deployment Fails**
   - Ensure sufficient rBTC for deployment
   - Check factory contract address
   - Verify user has RIF tokens

3. **Relay Requests Fail**
   - Check server logs
   - Verify token balance and allowance
   - Ensure server has sufficient rBTC

4. **Transaction Reverts**
   - Check gas limits
   - Verify contract addresses
   - Check token approvals

### Debug Commands

```bash
# Check server logs
tail -f rif-relay-server/logs/server.log

# Check RPC connection
curl -X POST https://public-node.testnet.rsk.co \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# Check smart wallet deployment
npx hardhat verify --network rootstock-testnet <SMART_WALLET_ADDRESS>
```

## 📊 Monitoring

### Server Metrics

- Request count
- Success rate
- Average gas used
- Error rate

### Client Metrics

- Smart wallet deployments
- Token approvals
- Transaction success rate
- Gas savings

## 🔒 Security Considerations

1. **Private Key Security**
   - Store relay worker private key securely
   - Use environment variables
   - Consider using hardware wallets

2. **Server Security**
   - Run server behind firewall
   - Use HTTPS in production
   - Implement rate limiting

3. **Smart Wallet Security**
   - Verify smart wallet ownership
   - Check token allowances
   - Validate transaction data

## 🚀 Production Deployment

### Server Deployment

1. **Use a VPS or cloud service**
2. **Set up reverse proxy (nginx)**
3. **Configure SSL certificates**
4. **Set up monitoring and logging**
5. **Implement backup strategies**

### Client Deployment

1. **Update server URL to production**
2. **Implement error handling**
3. **Add retry logic**
4. **Set up analytics**

## 📚 Additional Resources

- [RIF Relay Documentation](https://dev.rootstock.io/developers/integrate/rif-relay/)
- [Smart Wallets Guide](https://dev.rootstock.io/developers/integrate/rif-relay/smart-wallets/)
- [RIF Token Information](https://rif.technology/)
- [Rootstock Testnet Faucet](https://faucet.testnet.rsk.co/)

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section
2. Review server logs
3. Test with the provided test scripts
4. Contact the RIF community
5. Open an issue in the repository

---

**Happy gas-less transacting! 🎉**
