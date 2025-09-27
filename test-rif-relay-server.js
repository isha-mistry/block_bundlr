#!/usr/bin/env node

/**
 * Test script for RIF Relay Server
 * Tests all server endpoints to ensure proper functionality
 */

const https = require('https');
const http = require('http');

const SERVER_URL = 'http://localhost:8090';

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

async function testServer() {
  console.log('🧪 Testing RIF Relay Server...\n');
  
  const tests = [
    {
      name: 'Health Check',
      url: `${SERVER_URL}/health`,
      method: 'GET'
    },
    {
      name: 'Server Info',
      url: `${SERVER_URL}/info`,
      method: 'GET'
    },
    {
      name: 'Supported Tokens',
      url: `${SERVER_URL}/tokens`,
      method: 'GET'
    },
    {
      name: 'Gas Price',
      url: `${SERVER_URL}/gas-price`,
      method: 'GET'
    },
    {
      name: 'Relay Request (Mock)',
      url: `${SERVER_URL}/relay`,
      method: 'POST',
      body: JSON.stringify({
        from: '0x1234567890123456789012345678901234567890',
        to: '0x0987654321098765432109876543210987654321',
        data: '0x',
        gas: '21000',
        gasPrice: '1000000000',
        value: '0',
        nonce: '1',
        tokenContract: '0x19F64674D8A5B4E652319F5e239eFd3bc969A1fE',
        tokenAmount: '1000000000000000000',
        tokenGas: '21000',
        relayHub: '0xAd525463961399793f8716b0D85133ff7503a7C2'
      })
    }
  ];

  for (const test of tests) {
    try {
      console.log(`🔍 Testing ${test.name}...`);
      
      const options = {
        method: test.method,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      if (test.body) {
        options.headers['Content-Length'] = Buffer.byteLength(test.body);
      }
      
      const result = await makeRequest(test.url, options);
      
      if (result.status >= 200 && result.status < 300) {
        console.log(`✅ ${test.name}: SUCCESS (${result.status})`);
        if (test.name === 'Health Check') {
          console.log(`   Network: ${result.data.network}`);
          console.log(`   Chain ID: ${result.data.chainId}`);
          console.log(`   Version: ${result.data.version}`);
        } else if (test.name === 'Server Info') {
          console.log(`   Name: ${result.data.name}`);
          console.log(`   Version: ${result.data.version}`);
        } else if (test.name === 'Supported Tokens') {
          console.log(`   Tokens: ${result.data.supportedTokens.length}`);
          result.data.supportedTokens.forEach(token => {
            console.log(`   - ${token.symbol} (${token.name})`);
          });
        } else if (test.name === 'Gas Price') {
          console.log(`   Gas Price: ${result.data.gasPriceGwei} Gwei`);
        } else if (test.name === 'Relay Request (Mock)') {
          console.log(`   Transaction Hash: ${result.data.transactionHash}`);
          console.log(`   Status: ${result.data.status}`);
        }
      } else {
        console.log(`❌ ${test.name}: FAILED (${result.status})`);
        console.log(`   Error: ${result.data.error || result.data}`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR`);
      console.log(`   ${error.message}`);
    }
    
    console.log('');
  }
  
  console.log('🎉 RIF Relay Server testing complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. Open your browser to http://localhost:3000/real-rif-test');
  console.log('2. Connect your wallet to Rootstock Testnet');
  console.log('3. Test the RIF Relay integration');
  console.log('4. Deploy smart wallet and approve RIF tokens');
  console.log('5. Execute gas-less transactions!');
}

// Run the tests
testServer().catch(console.error);
