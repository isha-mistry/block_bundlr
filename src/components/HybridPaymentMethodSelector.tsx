'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  Zap,
  Wallet,
  CheckCircle,
  AlertCircle,
  Loader2,
  Coins,
  Activity,
  ArrowRight
} from 'lucide-react';
import { HybridRIFClient, type SmartWalletInfo, type TokenStatus } from '../lib/hybrid-rif-client';
import { getRequiredRifTokens } from '../config/rif-config';
import { useAccount, useWalletClient } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import ClientOnly from './ClientOnly';

export type PaymentMethod = 'rbtc' | 'rif';

interface HybridPaymentMethodSelectorProps {
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onSmartWalletReady: (isReady: boolean) => void;
  onTokenStatusChange: (status: TokenStatus | null) => void;
  rifClient: HybridRIFClient;
  batchSize: number;
  paymentMethod: PaymentMethod;
}

export default function HybridPaymentMethodSelector({
  onPaymentMethodChange,
  onSmartWalletReady,
  onTokenStatusChange,
  rifClient,
  batchSize,
  paymentMethod
}: HybridPaymentMethodSelectorProps) {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [smartWallet, setSmartWallet] = useState<SmartWalletInfo | null>(null);
  const [tokenStatus, setTokenStatus] = useState<TokenStatus | null>(null);
  const [rifBalance, setRifBalance] = useState<bigint>(BigInt(0));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const requiredRifTokens = getRequiredRifTokens(batchSize);
  const requiredRifAmount = parseEther(requiredRifTokens.toString());

  useEffect(() => {
    if (address && walletClient) {
      rifClient.setWalletClient(walletClient, address);
      loadRifData();
    }
  }, [address, walletClient, batchSize]);

  const loadRifData = async () => {
    if (!address) return;

    setIsLoading(true);
    setError('');

    try {
      // Get smart wallet info (hybrid: uses user address)
      const walletInfo = await rifClient.getSmartWallet(address);
      setSmartWallet(walletInfo);

      // Get token status
      const status = await rifClient.checkTokenStatus(address, batchSize);
      setTokenStatus(status);
      onTokenStatusChange(status);

      // Get RIF balance
      const balance = await rifClient.getRifBalance(address);
      setRifBalance(balance);

      // Check if ready for RIF payments
      const isReady = status.isApproved && status.balance >= requiredRifAmount;
      onSmartWalletReady(isReady);

    } catch (err: any) {
      setError(err.message || 'Failed to load RIF data');
      onSmartWalletReady(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveTokens = async () => {
    if (!address) return;

    setIsLoading(true);
    setError('');

    try {
      const approveAmount = requiredRifAmount * BigInt(10); // Approve 10x for multiple transactions
      await rifClient.approveTokens(address, approveAmount);

      // Wait a moment for the transaction to be mined
      setTimeout(() => {
        loadRifData(); // Reload data after approval
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Failed to approve tokens');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (error) return <AlertCircle className="h-4 w-4 text-red-400" />;
    if (paymentMethod === 'rif' && tokenStatus?.isApproved && tokenStatus.balance >= requiredRifAmount) {
      return <CheckCircle className="h-4 w-4 text-green-400" />;
    }
    return <AlertCircle className="h-4 w-4 text-yellow-400" />;
  };

  const getStatusText = () => {
    if (isLoading) return 'Loading...';
    if (error) return error;
    if (paymentMethod === 'rbtc') return 'Ready for rBTC payments';
    if (!tokenStatus?.isApproved) return 'RIF tokens not approved';
    if (tokenStatus.balance < requiredRifAmount) return 'Insufficient RIF balance';
    return 'Ready for RIF payments';
  };

  const getStatusColor = () => {
    if (error) return 'text-red-400';
    if (paymentMethod === 'rbtc') return 'text-green-400';
    if (paymentMethod === 'rif' && tokenStatus?.isApproved && tokenStatus.balance >= requiredRifAmount) {
      return 'text-green-400';
    }
    return 'text-yellow-400';
  };

  return (
    <ClientOnly>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            <span>Payment Method</span>
          </CardTitle>
          <CardDescription>
            Choose how to pay for gas fees
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Method Selection */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => onPaymentMethodChange('rbtc')}
              variant={paymentMethod === 'rbtc' ? 'default' : 'outline'}
              className={`h-16 flex flex-col space-y-1 ${paymentMethod === 'rbtc' ? 'glass-button' : 'glass-card hover-lift'
                }`}
            >
              <Wallet className="h-5 w-5" />
              <span className="text-sm">rBTC</span>
            </Button>

            <Button
              onClick={() => onPaymentMethodChange('rif')}
              variant={paymentMethod === 'rif' ? 'default' : 'outline'}
              className={`h-16 flex flex-col space-y-1 ${paymentMethod === 'rif' ? 'glass-button' : 'glass-card hover-lift'
                }`}
            >
              <Coins className="h-5 w-5" />
              <span className="text-sm">RIF</span>
            </Button>
          </div>

          {/* Payment Method Info */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Selected Method:</span>
              <div className="flex items-center space-x-2">
                {getStatusIcon()}
                <span className={`text-sm ${getStatusColor()}`}>
                  {paymentMethod === 'rbtc' ? 'rBTC' : 'RIF Tokens'}
                </span>
              </div>
            </div>
            <p className={`text-sm ${getStatusColor()}`}>
              {getStatusText()}
            </p>
          </div>

          {/* RIF Token Details */}
          {paymentMethod === 'rif' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">RIF Balance:</span>
                    <span className="text-sm text-white">
                      {formatEther(rifBalance)} RIF
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Required:</span>
                    <span className="text-sm text-white">
                      {requiredRifTokens} RIF
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Approval:</span>
                    <div className="flex items-center space-x-2">
                      {tokenStatus?.isApproved ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                      )}
                      <span className="text-sm">
                        {tokenStatus?.isApproved ? 'Approved' : 'Not Approved'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Allowance:</span>
                    <span className="text-sm text-white">
                      {tokenStatus ? formatEther(tokenStatus.allowance) : '0'} RIF
                    </span>
                  </div>
                </div>
              </div>

              {!tokenStatus?.isApproved && (
                <Button
                  onClick={handleApproveTokens}
                  disabled={isLoading || !tokenStatus?.balance || tokenStatus.balance < requiredRifAmount}
                  className="w-full glass-button hover-lift"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Approve RIF Tokens for Contract
                </Button>
              )}

              {tokenStatus?.balance !== undefined && tokenStatus.balance < requiredRifAmount && (
                <div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-400/20">
                  <p className="text-sm text-red-400">
                    ⚠️ Insufficient RIF balance. You need at least {requiredRifTokens} RIF tokens.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* How it Works */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">How it works:</h4>
            {paymentMethod === 'rbtc' ? (
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">1</span>
                  <span>Pay gas fees directly with rBTC</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">2</span>
                  <span>Execute batch transfer on BlockBundlr contract</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center text-xs font-bold text-orange-400">1</span>
                  <span>Pay {requiredRifTokens} RIF tokens for gas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center text-xs font-bold text-orange-400">2</span>
                  <span>Execute batch transfer on BlockBundlr contract</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center text-xs font-bold text-orange-400">3</span>
                  <span>Contract: {smartWallet?.address ? `${smartWallet.address.slice(0, 6)}...${smartWallet.address.slice(-4)}` : 'Loading...'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Success State */}
          {paymentMethod === 'rif' && tokenStatus?.isApproved && tokenStatus.balance >= requiredRifAmount && (
            <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-400/20">
              <p className="text-sm text-green-400">
                🎉 Ready for RIF-powered batch transactions!
              </p>
            </div>
          )}

          {/* Contract Info */}
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-400/20">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">Transaction Target</span>
            </div>
            <p className="text-xs text-gray-400">
              All transactions will be executed on the BlockBundlr contract:
            </p>
            <p className="text-xs font-mono text-blue-300 break-all">
              0x05A76962F8Bd0141c79f7C18688f56FF5964DB9D
            </p>
          </div>
        </CardContent>
      </Card>
    </ClientOnly>
  );
}
