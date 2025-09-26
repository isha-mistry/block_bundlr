'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, ArrowRight } from 'lucide-react';

interface WalletConnectProps {
  onWalletConnected: (address: string) => void;
}

export default function WalletConnect({ onWalletConnected }: WalletConnectProps) {
  return (
    <Card className="w-full max-w-md mx-auto glass-card glow-border">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 rounded-full bg-orange-500/20 border border-orange-400/30 w-fit">
          <Wallet className="h-8 w-8 text-orange-400" />
        </div>
        <CardTitle className="glow-text">Connect Your Wallet</CardTitle>
        <CardDescription className="text-gray-300">
          Connect your wallet to start adding recipients and managing batch transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          <ConnectButton/>
        </div>
      </CardContent>
    </Card>
  );
}

