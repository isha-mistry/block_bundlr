'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { RealRIFRelayClient } from '../../lib/real-rif-relay-client';
import RealRIFRelayIntegration from '../../components/RealRIFRelayIntegration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  Zap, 
  Wallet, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Server,
  Activity,
  Settings,
  Play
} from 'lucide-react';
import ClientOnly from '../../components/ClientOnly';

export default function RealRIFTestPage() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [rifClient] = useState(() => new RealRIFRelayClient());
  const [isSmartWalletReady, setIsSmartWalletReady] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  // Initialize RIF client when wallet is connected
  useEffect(() => {
    if (walletClient && address && !isInitialized) {
      rifClient.setWalletClient(walletClient, address);
      setIsInitialized(true);
      console.log('Real RIF Relay Client initialized with wallet:', address);
    }
  }, [walletClient, address, rifClient, isInitialized]);

  const runTests = async () => {
    const tests = [
      {
        name: 'Server Connection',
        test: async () => {
          const isOnline = await rifClient.checkRelayServerStatus();
          return { success: isOnline, message: isOnline ? 'Server online' : 'Server offline' };
        }
      },
      {
        name: 'RIF Token Balance',
        test: async () => {
          if (!address) throw new Error('No address');
          const balance = await rifClient.getRifBalance(address);
          return { success: true, message: `Balance: ${rifClient.formatRifAmount(balance)} RIF` };
        }
      },
      {
        name: 'Smart Wallet Address',
        test: async () => {
          if (!address) throw new Error('No address');
          const smartWallet = await rifClient.getSmartWallet(address);
          return { success: true, message: `Address: ${smartWallet.address}` };
        }
      },
      {
        name: 'Token Status',
        test: async () => {
          if (!address) throw new Error('No address');
          const status = await rifClient.checkTokenStatus(address, 5);
          return { 
            success: true, 
            message: `Approved: ${status.isApproved}, Balance: ${rifClient.formatRifAmount(status.balance)} RIF` 
          };
        }
      }
    ];

    const results = [];
    for (const test of tests) {
      try {
        const result = await test.test();
        results.push({ name: test.name, ...result });
      } catch (error) {
        results.push({ 
          name: test.name, 
          success: false, 
          message: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
    
    setTestResults(results);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 pt-20">
        <Card className="w-full max-w-md glass-card glow-border hover-lift">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
              <Wallet className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold glow-text">
              Real RIF Relay Test
            </CardTitle>
            <CardDescription className="text-gray-300 text-base">
              Connect your wallet to test real RIF Relay integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-gray-400">
              <p>Please connect your wallet to continue</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ClientOnly>
      <div className="min-h-screen p-4 pt-24 pb-16">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white modern-text">
              Real RIF Relay Integration Test
            </h1>
            <p className="text-xl text-gray-300 modern-text">
              Test real gas-less transactions with RIF tokens
            </p>
          </div>

          {/* Connection Status */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {isInitialized ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <Loader2 className="h-5 w-5 animate-spin text-yellow-400" />
                )}
                <span className={isInitialized ? 'text-green-400' : 'text-yellow-400'}>
                  {isInitialized ? 'Wallet Connected' : 'Connecting...'}
                </span>
              </CardTitle>
              <CardDescription>
                {isInitialized 
                  ? `Connected to ${address}` 
                  : 'Initializing RIF Relay client with your wallet'
                }
              </CardDescription>
            </CardHeader>
          </Card>

          {/* RIF Relay Integration */}
          <RealRIFRelayIntegration
            onSmartWalletReady={setIsSmartWalletReady}
            onTokenStatusChange={setTokenStatus}
            batchSize={5}
          />

          {/* Test Results */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-400" />
                <span>Test Results</span>
              </CardTitle>
              <CardDescription>
                Run tests to verify RIF Relay functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={runTests}
                className="w-full glass-button hover-lift"
              >
                <Play className="mr-2 h-4 w-4" />
                Run Tests
              </Button>

              {testResults.length > 0 && (
                <div className="space-y-2">
                  {testResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                      <span className="text-sm text-gray-300">{result.name}</span>
                      <div className="flex items-center space-x-2">
                        {result.success ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-400" />
                        )}
                        <span className={`text-sm ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                          {result.message}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Setup Instructions */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-purple-400" />
                <span>Setup Instructions</span>
              </CardTitle>
              <CardDescription>
                Follow these steps to set up RIF Relay server
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">1</span>
                  <span className="text-gray-300">Set up RIF Relay server: <code className="bg-gray-800 px-2 py-1 rounded">node scripts/setup-rif-relay-server.js</code></span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">2</span>
                  <span className="text-gray-300">Set relay worker private key: <code className="bg-gray-800 px-2 py-1 rounded">export RELAY_WORKER_PRIVATE_KEY=0x...</code></span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">3</span>
                  <span className="text-gray-300">Start the server: <code className="bg-gray-800 px-2 py-1 rounded">cd rif-relay-server && ./start-server.sh</code></span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">4</span>
                  <span className="text-gray-300">Deploy smart wallet and approve RIF tokens</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">5</span>
                  <span className="text-gray-300">Test gas-less transactions</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => window.open('http://localhost:8090/health', '_blank')}
                    variant="outline"
                    className="glass-card hover-lift"
                  >
                    <Server className="mr-2 h-4 w-4" />
                    Check Server
                  </Button>
                  <Button
                    onClick={() => window.open('/RIF_RELAY_SETUP_GUIDE.md', '_blank')}
                    variant="outline"
                    className="glass-card hover-lift"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Setup Guide
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Summary */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                <span>Integration Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-white">Client Status</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Wallet:</span>
                      <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
                        {isConnected ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">RIF Client:</span>
                      <span className={isInitialized ? 'text-green-400' : 'text-red-400'}>
                        {isInitialized ? 'Initialized' : 'Not Initialized'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Smart Wallet:</span>
                      <span className={isSmartWalletReady ? 'text-green-400' : 'text-yellow-400'}>
                        {isSmartWalletReady ? 'Ready' : 'Not Ready'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-white">Token Status</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Balance:</span>
                      <span className="text-white">
                        {tokenStatus ? `${rifClient.formatRifAmount(tokenStatus.balance)} RIF` : 'Loading...'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Approval:</span>
                      <span className={tokenStatus?.isApproved ? 'text-green-400' : 'text-yellow-400'}>
                        {tokenStatus?.isApproved ? 'Approved' : 'Not Approved'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Required:</span>
                      <span className="text-white">5 RIF</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientOnly>
  );
}
