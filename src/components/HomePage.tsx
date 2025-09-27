'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArrowRight, Zap, Shield, Clock, Users, Calculator, Sparkles } from 'lucide-react';

function HomePage() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center space-y-8 py-16">
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl blur-2xl opacity-40"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-4 border border-white/20">
                  <Zap className="h-12 w-12 text-orange-400" />
                </div>
              </div>
              <h1 className="text-6xl font-bold text-orange-400 modern-text">
                BlockBundlR
              </h1>
            </div>

            <div className="space-y-4">
              <p className="text-3xl elegant-text text-white/90">
                Batch RBTC. Powered by RIF
              </p>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto modern-text leading-relaxed">
                Efficiently manage multiple RBTC transactions in a single batch operation.
                Pay gas fees with RIF tokens for gas-less transactions. Save on gas fees 
                and streamline your blockchain interactions with our cutting-edge glassmorphism interface.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/same-chain">
              <Button className="glass-button hover-lift hover-glow px-8 py-4 text-lg h-auto">
                <Zap className="mr-2 h-5 w-5" />
                Start Batching
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-16">
          <Card className="glass-card hover-lift group">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-orange-400" />
              </div>
              <CardTitle className="text-xl modern-text">Multiple Recipients</CardTitle>
              <CardDescription className="text-gray-300 modern-text">
                Send RBTC to multiple addresses in a single transaction, reducing gas costs and complexity.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass-card hover-lift group">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-8 w-8 text-blue-400" />
              </div>
              <CardTitle className="text-xl modern-text">RIF Token Payments</CardTitle>
              <CardDescription className="text-gray-300 modern-text">
                Pay gas fees with RIF tokens instead of rBTC for gas-less batch transactions.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass-card hover-lift group">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-8 w-8 text-green-400" />
              </div>
              <CardTitle className="text-xl modern-text">Fast Processing</CardTitle>
              <CardDescription className="text-gray-300 modern-text">
                Optimized for speed with instant transaction processing and real-time status updates.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="py-16">
          <Card className="glass-card-premium">
            <CardContent className="p-12">
              <div className="text-center space-y-8">
                <h2 className="text-3xl font-bold text-white modern-text">
                  Why Choose BlockBundlR?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-orange-400">90%</div>
                    <div className="text-gray-300 modern-text">Gas Savings</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-orange-400">50+</div>
                    <div className="text-gray-300 modern-text">Recipients per Batch</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-orange-400">99.9%</div>
                    <div className="text-gray-300 modern-text">Uptime</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="py-16">
          <div className="text-center space-y-12">
            <h2 className="text-4xl font-bold text-white modern-text">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4 text-center">
                <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center floating-animation">
                  <Calculator className="h-10 w-10 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white modern-text">1. Add Recipients</h3>
                <p className="text-gray-300 modern-text">Enter recipient addresses and amounts for your batch transaction.</p>
              </div>

              <div className="space-y-4 text-center">
                <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center floating-animation" style={{ animationDelay: '2s' }}>
                  <Zap className="h-10 w-10 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white modern-text">2. Review & Submit</h3>
                <p className="text-gray-300 modern-text">Review your transaction details and submit the batch to the network.</p>
              </div>

              <div className="space-y-4 text-center">
                <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center floating-animation" style={{ animationDelay: '4s' }}>
                  <Shield className="h-10 w-10 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white modern-text">3. Confirmation</h3>
                <p className="text-gray-300 modern-text">Track your transaction status and receive confirmation when complete.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;