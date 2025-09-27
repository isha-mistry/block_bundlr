'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import WalletConnect from './WalletConnect';
import RecipientForm from './RecipientForm';
import RecipientsTable from './RecipientsTable';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Send, RotateCcw, CheckCircle, Calculator, Users, Zap, ArrowRight } from 'lucide-react';
import { Recipient } from '@/types';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/config';

export default function BatchChainApp() {
  const { isConnected } = useAccount();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Calculate total amount
  const totalAmount = useMemo(() => {
    return recipients.reduce((total, recipient) => {
      const amount = parseFloat(recipient.amount) || 0;
      return total + amount;
    }, 0);
  }, [recipients]);

  const handleAddRecipient = useCallback((recipient: { address: string; amount: string }) => {
    const newRecipient: Recipient = {
      id: Date.now().toString(),
      address: recipient.address,
      amount: recipient.amount,
    };
    setRecipients(prev => [...prev, newRecipient]);
  }, []);

  const handleUpdateRecipient = useCallback((id: string, address: string, amount: string) => {
    setRecipients(prev =>
      prev.map(recipient =>
        recipient.id === id ? { ...recipient, address, amount } : recipient
      )
    );
  }, []);

  const handleDeleteRecipient = useCallback((id: string) => {
    setRecipients(prev => prev.filter(recipient => recipient.id !== id));
  }, []);

  const { writeContract, data: txHash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (isSuccess && txHash) {
      console.log('Transaction confirmed, hash:', txHash);
      setIsSubmitted(true);
    }
  }, [isSuccess, txHash]);

  const handleSubmit = async () => {
    if (recipients.length === 0) return;

    setIsSubmitting(true);

    try {
      const recipientAddresses = recipients.map(r => r.address);
      const recipientAmounts = recipients.map(r => BigInt(parseEther(r.amount)));
      const totalValue = recipientAmounts.reduce((acc, val) => acc + val, BigInt(0));

      console.log('Submitting batchTransfer with:', {
        recipientAddresses,
        recipientAmounts,
        totalValue: totalValue.toString(),
      });

      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'batchTransfer',
        args: [recipientAddresses, recipientAmounts],
        value: totalValue,
      });
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setRecipients([]);
    setIsSubmitted(false);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-md">
          <Card className="glass-card glow-border hover-lift">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold glow-text">
                Welcome to BlockBundlR
              </CardTitle>
              <CardDescription className="text-gray-300 text-base">
                Connect your wallet to start creating batch transactions on the same chain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <WalletConnect onWalletConnected={() => { }} />
              <div className="text-center text-sm text-gray-400">
                <p>Secure • Fast • Efficient</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 pt-20">
        <Card className="w-full max-w-md mx-auto glass-card glow-border hover-lift">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-green-500/20 border border-green-400/30 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-400">
              Transaction Submitted!
            </CardTitle>
            <CardDescription className="text-gray-300 text-base">
              Your batch transaction has been successfully submitted to the network and is being processed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-400/20">
              <p className="text-sm text-green-300">
                You can view the transaction status in your wallet or on the blockchain explorer.
              </p>
            </div>
            <Button
              onClick={handleReset}
              className="w-full glass-button hover-lift hover-glow"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Start New Batch
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pt-20">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold glow-text">Same Chain Batch Transaction</h1>
            </div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Efficiently send multiple transactions to different addresses in a single batch operation
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{recipients.length}</div>
                <div className="text-sm text-gray-400">Recipients</div>
              </CardContent>
            </Card>

            <Card className="glass-card hover-lift">
              <CardContent className="p-4 text-center">
                <Calculator className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{totalAmount.toFixed(4)}</div>
                <div className="text-sm text-gray-400">Total ETH</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Form Section */}
          <div className="space-y-6">
            <RecipientForm onAddRecipient={handleAddRecipient} isSubmitting={isSubmitting} />
          </div>

          {/* Table Section */}
          <div className="space-y-6">
            <RecipientsTable
              recipients={recipients}
              onUpdateRecipient={handleUpdateRecipient}
              onDeleteRecipient={handleDeleteRecipient}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>

        {/* Submit Section */}
        {recipients.length > 0 && (
          <div className="flex justify-center">
            <Card className="glass-card glow-border hover-lift max-w-2xl w-full">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-orange-400">Ready to Submit Batch Transaction</h3>
                    <p className="text-gray-300">Review your transaction details before submitting</p>
                  </div>

                  {/* Transaction Summary */}
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{recipients.length}</div>
                      <div className="text-sm text-gray-400">Recipients</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">{totalAmount.toFixed(4)} ETH</div>
                      <div className="text-sm text-gray-400">Total Amount</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || isPending}
                      className="glass-button hover-lift hover-glow min-w-[160px] h-12"
                    >
                      {isSubmitting || isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Submit Batch
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <Button onClick={handleReset} disabled={isSubmitting || isPending} className="min-w-[160px] h-12 glass-button">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset All
                    </Button>
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="mt-2 text-red-500 text-sm">
                      Error: {(error as Error).message}
                    </div>
                  )}

                  <div className="text-xs text-gray-400 text-center">
                    <p>This will create a single transaction that sends to all recipients</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
