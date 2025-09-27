'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import WalletConnect from './WalletConnect';
import RecipientForm from './RecipientForm';
import RecipientsTable from './RecipientsTable';
import HybridPaymentMethodSelector, { PaymentMethod } from './HybridPaymentMethodSelector';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Send, RotateCcw, CheckCircle, Calculator, Users, Zap, ArrowRight } from 'lucide-react';
import { Recipient } from '@/types';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useWalletClient } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/config';
import { HybridRIFClient, type TokenStatus } from '../lib/hybrid-rif-client';
import { getRequiredRifTokens } from '../config/rif-config';
import FloatingChatbot from "./ui/FloatingChatbot";
import { ParsedRecipient } from "./ui/DefiChatbot";

// import { parseEther } from "viem"; // Keep for 18 decimals tokens

export default function BatchChainApp() {
  const { isConnected, address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('rbtc');
  const [rifClient] = useState(() => new HybridRIFClient());
  const [tokenStatus, setTokenStatus] = useState<TokenStatus | null>(null);
  const [isSmartWalletReady, setIsSmartWalletReady] = useState(false);



  // Define decimals for tokens you use
  const tokenDecimalsMap: Record<string, number> = {
    trtbc: 18,
    trbtc: 18, // Replace with actual decimal count of tRBTC token
  };

  // Helper function to parse amount string into bigint based on decimals
  function parseAmount(amountStr: string, decimals: number): bigint {
    // Split integer and fractional part
    const [whole, fraction = ""] = amountStr.split(".");
    // Right pad fractional part to token decimals
    const fractionPadded = (fraction + "0".repeat(decimals)).slice(0, decimals);
    const wholePart = BigInt(whole) * BigInt(10) ** BigInt(decimals);
    const fractionPart = BigInt(fractionPadded);
    return wholePart + fractionPart;
  }

  const handleSubmitParsedBatch = async (parsedRecipients: ParsedRecipient[]) => {
    if (parsedRecipients.length === 0) return;

    setIsSubmitting(true);
    setError("");

    try {
      // Filter batch by single token or pass all - depending on your contract logic
      const filtered = parsedRecipients.filter(r => tokenDecimalsMap[r.token.toLowerCase()] !== undefined);

      // Separate by token if your contract supports only one token per call; here assume one token per batch call
      // For example, handle only 'trbtc':
      const tokenToSend = "trbtc";
      const recipientsForToken = filtered.filter(r => r.token.toLowerCase() === tokenToSend);
      if (recipientsForToken.length === 0) {
        throw new Error(`No recipients with token ${tokenToSend} found`);
      }

      const decimals = tokenDecimalsMap[tokenToSend];
      const recipientAddresses = recipientsForToken.map(r => r.address);
      const recipientAmounts = recipientsForToken.map(r => parseAmount(r.amount, decimals));
      const totalValue = recipientAmounts.reduce((acc, val) => acc + val, BigInt(0));

      // Set recipients for UI display
      const formattedRecipients = recipientsForToken.map(r => ({
        id: Date.now().toString() + Math.random().toString(36).substring(2),
        address: r.address,
        amount: r.amount,
      }));
      setRecipients(formattedRecipients);

      // Perform contract call based on payment method
      if (paymentMethod === 'rbtc') {
        await writeContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "batchTransfer",
          args: [recipientAddresses, recipientAmounts],
          value: totalValue,
        });
      } else if (paymentMethod === 'rif') {
        if (!address) throw new Error('Wallet not connected');
        if (!isSmartWalletReady) throw new Error('Smart wallet not ready for RIF payments');

        const requiredRifTokens = getRequiredRifTokens(recipientsForToken.length);
        const rifTokenAmount = BigInt(requiredRifTokens) * BigInt(10 ** 18);

        await rifClient.batchTransfer(
          address,
          recipientAddresses as `0x${string}`[],
          recipientAmounts,
          rifTokenAmount
        );
      }
    } catch (err: any) {
      setError(err.message || "Transaction failed");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };


  // Calculate total amount
  const totalAmount = useMemo(() => {
    return recipients.reduce((total: number, recipient: Recipient) => {
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
    setRecipients((prev: Recipient[]) =>
      prev.map((recipient: Recipient) =>
        recipient.id === id ? { ...recipient, address, amount } : recipient
      )
    );
  }, []);

  const handleDeleteRecipient = useCallback((id: string) => {
    setRecipients((prev: Recipient[]) => prev.filter((recipient: Recipient) => recipient.id !== id));
  }, []);

  const { writeContract, data: txHash, error: contractError, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (isSuccess && txHash) {
      console.log('Transaction confirmed, hash:', txHash);
      setIsSubmitted(true);
    }
  }, [isSuccess, txHash]);

  // Initialize RIF client when wallet is connected
  useEffect(() => {
    if (walletClient && address) {
      rifClient.setWalletClient(walletClient, address);
    }
  }, [walletClient, address, rifClient]);

  const handleSubmit = async () => {
    if (recipients.length === 0) return;

    setIsSubmitting(true);
    setError("");

    try {
      const recipientAddresses = recipients.map((r: Recipient) => r.address);
      const recipientAmounts = recipients.map((r: Recipient) => BigInt(parseEther(r.amount)));
      const totalValue = recipientAmounts.reduce((acc: bigint, val: bigint) => acc + val, BigInt(0));

      console.log('Submitting batchTransfer with:', {
        recipientAddresses,
        recipientAmounts,
        totalValue: totalValue.toString(),
        paymentMethod,
      });

      if (paymentMethod === 'rbtc') {
        // Traditional rBTC payment
        await writeContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'batchTransfer',
          args: [recipientAddresses, recipientAmounts],
          value: totalValue,
        });
      } else if (paymentMethod === 'rif') {
        // RIF Relay payment
        if (!address) throw new Error('Wallet not connected');
        if (!isSmartWalletReady) throw new Error('Smart wallet not ready for RIF payments');

        const requiredRifTokens = getRequiredRifTokens(recipients.length);
        const rifTokenAmount = BigInt(requiredRifTokens) * BigInt(10 ** 18); // Convert to wei

        await rifClient.batchTransfer(
          address,
          recipientAddresses as `0x${string}`[],
          recipientAmounts,
          rifTokenAmount
        );
      }
    } catch (err: any) {
      console.error('Submission failed:', err);
      setError(err.message || 'Transaction failed');
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
            <div className="text-center p-4 rounded-xl bg-green-500/10 border border-green-400/20">
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
    <div className="min-h-screen p-4 pt-24 pb-16">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-8 pt-10">
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl blur-2xl opacity-30"></div>
              </div>
              <h1 className="text-5xl font-bold gradient-text modern-text">
                Bundle Your Actions Together
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto modern-text leading-relaxed">
              Efficiently send multiple RBTC transactions to different addresses in a single batch operation
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card hover-lift group">
              <CardContent className="p-6 text-center">
                <div className="mx-auto w-16 h-16 rounded-3xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  <Users className="h-8 w-8 text-orange-400" />
                </div>
                <div className="text-3xl font-bold text-white modern-text">{recipients.length}</div>
                <div className="text-sm text-gray-400 modern-text">Recipients</div>
              </CardContent>
            </Card>

            <Card className="glass-card hover-lift group">
              <CardContent className="p-6 text-center">
                <div className="mx-auto w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  <Calculator className="h-8 w-8 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white modern-text">{totalAmount.toFixed(4)}</div>
                <div className="text-sm text-gray-400 modern-text">Total RBTC</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="">
          <HybridPaymentMethodSelector
            onPaymentMethodChange={setPaymentMethod}
            onSmartWalletReady={setIsSmartWalletReady}
            onTokenStatusChange={setTokenStatus}
            rifClient={rifClient}
            batchSize={recipients.length}
            paymentMethod={paymentMethod}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
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
            <Card className="glass-card-premium glow-border hover-lift max-w-3xl w-full">
              <CardContent className="p-10">
                <div className="text-center space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
                        <Send className="h-6 w-6 text-orange-400" />
                      </div>
                      <h3 className="text-3xl font-bold text-orange-400 modern-text">
                        Ready to Submit Batch Transaction
                      </h3>
                    </div>
                    <p className="text-gray-300 text-lg modern-text">
                      Review your transaction details before submitting to the network
                    </p>
                  </div>

                  {/* Transaction Summary */}
                  <div className="grid grid-cols-2 gap-6 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <div className="text-center space-y-2">
                      <div className="text-4xl font-bold text-white modern-text">{recipients.length}</div>
                      <div className="text-sm text-gray-400 modern-text">Recipients</div>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-4xl font-bold text-orange-400 modern-text">
                        {paymentMethod === 'rbtc'
                          ? `${totalAmount.toFixed(4)} rBTC`
                          : `${getRequiredRifTokens(recipients.length)} RIF`
                        }
                      </div>
                      <div className="text-sm text-gray-400 modern-text">
                        {paymentMethod === 'rbtc' ? 'Total Amount' : 'Gas Cost'}
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Info */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-center space-x-2">
                      {paymentMethod === 'rbtc' ? (
                        <>
                          <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                            <span className="text-orange-400 text-xs">₿</span>
                          </div>
                          <span className="text-sm text-gray-300">
                            Paying with rBTC - Traditional gas payment
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Zap className="h-3 w-3 text-blue-400" />
                          </div>
                          <span className="text-sm text-gray-300">
                            Paying with RIF - Gas-less transaction
                          </span>
                          {!isSmartWalletReady && (
                            <span className="text-xs text-yellow-400 ml-2">
                              (Smart wallet not ready)
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || isPending || (paymentMethod === 'rif' && !isSmartWalletReady)}
                      className="glass-button hover-lift hover-glow min-w-[200px] h-14 text-lg modern-text"
                    >
                      {isSubmitting || isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-3 h-6 w-6" />
                          {paymentMethod === 'rif' ? 'Submit with RIF' : 'Submit Batch'}
                          <ArrowRight className="ml-3 h-5 w-5" />
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      disabled={isSubmitting || isPending}
                      className="min-w-[200px] h-14 text-lg glass-card hover-lift modern-text"
                    >
                      <RotateCcw className="mr-3 h-5 w-5" />
                      Reset All
                    </Button>
                  </div>

                  {/* Error message */}
                  {(contractError || error) && (
                    <div className="mt-2 text-red-500 text-sm">
                      {error || 'Error occurred, please try again!'}
                    </div>
                  )}

                  {/* RIF Payment Status */}
                  {paymentMethod === 'rif' && !isSmartWalletReady && (
                    <div className="mt-2 text-yellow-500 text-sm text-center">
                      Smart wallet not ready. Please deploy and approve tokens first.
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
      <FloatingChatbot onBatchSubmit={handleSubmitParsedBatch} />

    </div>
  );
}
