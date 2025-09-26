'use client';

import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import WalletConnect from './WalletConnect';
import RecipientForm from './RecipientForm';
import RecipientsTable from './RecipientsTable';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Send, RotateCcw, CheckCircle } from 'lucide-react';
import { Recipient } from '@/types';

export default function BatchChainApp() {
  const { isConnected, address } = useAccount();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
        recipient.id === id
          ? { ...recipient, address, amount }
          : recipient
      )
    );
  }, []);

  const handleDeleteRecipient = useCallback((id: string) => {
    setRecipients(prev => prev.filter(recipient => recipient.id !== id));
  }, []);

  const handleSubmit = async () => {
    if (recipients.length === 0) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Reset form and show success
      setRecipients([]);
      setIsSubmitted(true);

      // Hide success message after 3 seconds
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      console.error('Submission failed:', error);
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <WalletConnect onWalletConnected={() => { }} />
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto glass-card glow-border">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 rounded-full bg-green-500/20 border border-green-400/30 w-fit">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
            <CardTitle className="text-green-400">Transaction Submitted!</CardTitle>
            <CardDescription className="text-gray-300">
              Your batch transaction has been successfully submitted to the network.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
    <div className="min-h-screen p-4 space-y-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold glow-text mb-4">
            Batch Chain
          </h1>
          <p className="text-gray-300 text-lg">
            Connect your wallet and manage batch transactions
          </p>
          <div className="mt-2 text-sm text-orange-400">
            Connected: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Form Section */}
          <div className="space-y-6">
            <RecipientForm
              onAddRecipient={handleAddRecipient}
              isSubmitting={isSubmitting}
            />
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
          <div className="mt-8 flex justify-center">
            <Card className="glass-card glow-border">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="text-orange-400 font-medium">
                    Ready to submit {recipients.length} recipient{recipients.length > 1 ? 's' : ''}
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="glass-button hover-lift hover-glow min-w-[120px]"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {isSubmitting ? 'Submitting...' : 'Submit Batch'}
                    </Button>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      disabled={isSubmitting}
                      className="min-w-[120px]"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
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

