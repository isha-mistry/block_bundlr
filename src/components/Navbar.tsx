'use client';

import { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { Button } from './ui/button';
import { Wallet, Menu, X, Zap } from 'lucide-react';
import WalletConnect from './WalletConnect';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navbar() {
  const { isConnected, address } = useAccount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  BlockBundlR
                </h1>
                <p className="text-xs text-gray-400 -mt-1">Batch Transactions</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300">Batch Transactions Made Simple</span>
              </div>

              {/* Wallet Button */}
              <div className="flex items-center space-x-3">
                <ConnectButton/>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-black/40 backdrop-blur-md rounded-lg mt-2 border border-white/10">
                <div className="px-3 py-2 text-sm text-gray-300">
                  Batch Transactions Made Simple
                </div>
                <div className="px-3 py-2">
                  <ConnectButton/>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
