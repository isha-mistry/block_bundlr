const express = require('express');
const cors = require('cors');
const { Web3 } = require('web3');
require('dotenv').config();

const app = express();
const PORT = process.env.RELAY_SERVER_PORT || 8090;

// Middleware
app.use(cors());
app.use(express.json());

// Web3 setup
const web3 = new Web3(process.env.RPC_URL || 'https://public-node.testnet.rsk.co');

// Configuration
const config = {
  network: {
    rpcUrl: process.env.RPC_URL || 'https://public-node.testnet.rsk.co',
    chainId: 31,
    name: 'Rootstock Testnet'
  },
  relay: {
    port: PORT,
    host: 'localhost',
    gasPrice: '1000000000', // 1 gwei
    maxGasLimit: '10000000'
  },
  contracts: {
    relayHub: '0xAd525463961399793f8716b0D85133ff7503a7C2',
    smartWalletFactory: '0xCBc3BC24da96Ef5606d3801E13E1DC6E98C5c877',
    rifToken: '0x19F64674D8A5B4E652319F5e239eFd3bc969A1fE'
  }
};

console.log('🚀 RIF Relay Server Starting...');
console.log(`📍 Network: ${config.network.name} (Chain ID: ${config.network.chainId})`);
console.log(`🔗 RPC URL: ${config.network.rpcUrl}`);
console.log(`⚡ Server Port: ${config.relay.port}`);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    network: config.network.name,
    chainId: config.network.chainId,
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Get server info
app.get('/info', (req, res) => {
  res.json({
    name: 'RIF Relay Server for BlockBundlR',
    version: '1.0.0',
    network: config.network,
    contracts: config.contracts,
    relay: config.relay
  });
});

// Relay endpoint
app.post('/relay', async (req, res) => {
  try {
    const { 
      from, 
      to, 
      data, 
      gas, 
      gasPrice, 
      value, 
      nonce, 
      tokenContract, 
      tokenAmount, 
      tokenGas, 
      relayHub 
    } = req.body;
    
    console.log('📨 Received relay request:', {
      from,
      to,
      gas,
      tokenAmount: tokenAmount ? web3.utils.fromWei(tokenAmount, 'ether') : '0',
      tokenContract,
      timestamp: new Date().toISOString()
    });

    // Validate request
    if (!from || !to || !data) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: from, to, data'
      });
    }

    // Check if token contract is RIF token
    if (tokenContract && tokenContract.toLowerCase() !== config.contracts.rifToken.toLowerCase()) {
      return res.status(400).json({
        success: false,
        error: 'Only RIF token payments are supported'
      });
    }

    // For now, return a mock response
    // In a real implementation, this would:
    // 1. Validate the request
    // 2. Check token balance and allowance
    // 3. Execute the transaction
    // 4. Return the transaction hash

    const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
    
    console.log('✅ Mock transaction created:', mockTxHash);
    
    res.json({
      success: true,
      transactionHash: mockTxHash,
      gasUsed: gas,
      status: 'success',
      message: 'Transaction relayed successfully (mock)',
      relayRequestId: 'req_' + Date.now()
    });

  } catch (error) {
    console.error('❌ Relay error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get supported tokens
app.get('/tokens', (req, res) => {
  res.json({
    supportedTokens: [
      {
        address: config.contracts.rifToken,
        symbol: 'tRIF',
        name: 'RIF Token',
        decimals: 18,
        network: 'Rootstock Testnet'
      }
    ]
  });
});

// Get gas price
app.get('/gas-price', async (req, res) => {
  try {
    const gasPrice = await web3.eth.getGasPrice();
    res.json({
      gasPrice: gasPrice.toString(),
      gasPriceGwei: web3.utils.fromWei(gasPrice, 'gwei'),
      network: config.network.name
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get gas price',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🎉 RIF Relay Server started successfully!');
  console.log(`📍 Server running on http://localhost:${PORT}`);
  console.log('🔗 Network: Rootstock Testnet');
  console.log('⚡ Ready to relay transactions!');
  console.log('');
  console.log('📋 Available endpoints:');
  console.log(`  GET  http://localhost:${PORT}/health`);
  console.log(`  GET  http://localhost:${PORT}/info`);
  console.log(`  POST http://localhost:${PORT}/relay`);
  console.log(`  GET  http://localhost:${PORT}/tokens`);
  console.log(`  GET  http://localhost:${PORT}/gas-price`);
  console.log('');
  console.log('🧪 Test the server:');
  console.log(`  curl http://localhost:${PORT}/health`);
});

module.exports = app;
