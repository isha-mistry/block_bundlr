'use client';

import { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { Button } from './ui/button';
import { Wallet, Menu, X, Zap } from 'lucide-react';
import WalletConnect from './WalletConnect';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { isConnected, address } = useAccount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeRoute = usePathname();

  return (
    <>
      <nav className="fixed top-6 left-6 right-6 z-50 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-full">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <Image src="/logo.png" alt="BlockBundlR" width={100} height={100} className="w-full" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Link
                  href="/"
                  className={`nav-link ${activeRoute === '/' ? 'nav-link-active' : 'text-gray-300 hover:text-white'}`}
                >
                  Home
                </Link>
                <Link
                  href="/same-chain"
                  className={`nav-link ${activeRoute === '/same-chain' ? 'nav-link-active' : 'text-gray-300 hover:text-white'}`}
                >
                  Batch Actions
                </Link>
              </div>

              {/* Wallet Button */}
              <div className="flex items-center">
                <div className="glass-card p-1">
                  <ConnectButton />
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white glass-card p-3"
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
            <div className="md:hidden mb-4 mt-4">
              <div className="glass-card-premium p-6 space-y-4 rounded-3xl mx-4">
                <div className="flex flex-col space-y-3">
                  <Link
                    href="/"
                    className={`nav-link text-lg ${activeRoute === '/' ? 'nav-link-active' : 'text-gray-300 hover:text-white'}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/same-chain"
                    className={`nav-link text-lg ${activeRoute === '/same-chain' ? 'nav-link-active' : 'text-gray-300 hover:text-white'}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Batch Actions
                  </Link>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <ConnectButton />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
