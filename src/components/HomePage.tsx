'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

function HomePage() {
  return (
    <div className="min-h-screen w-full items-center justify-center px-6 pt-32 pb-20">
      <div className="text-center">
        {/* Main Container with Rounded Border */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[3rem] p-12 md:p-16 lg:p-20">
          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-purple-500/10 rounded-[3rem] pointer-events-none"></div>
          <div className="relative z-10 py-5">
            {/* Brand Name */}
            <div className="space-y-8 mb-12">
              {/* Tagline in Great Vibes Font */}
              <div className="relative">
                <p className="italic text-3xl md:text-4xl lg:text-5xl text-orange-300/90 font-[var(--font-great-vibes)] leading-relaxed">
                  Batch RBTC. Powered by RIF
                </p>
              </div>
            </div>

            {/* Project Description */}
            <div className="space-y-8 mb-12">
              <p className="text-lg md:text-xl text-gray-300/90 leading-relaxed max-w-2xl mx-auto modern-text">
                Experience the future of blockchain transactions with our elegant batch processing platform.
                Send multiple RBTC transfers efficiently while saving on gas fees through RIF token payments.
              </p>

              {/* Key Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm md:text-base">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="text-orange-400 font-semibold mb-1">Smart Batching</div>
                  <div className="text-gray-400">Multiple recipients, single transaction</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="text-orange-400 font-semibold mb-1">RIF Payments</div>
                  <div className="text-gray-400">Gas-less transactions with RIF tokens</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="text-orange-400 font-semibold mb-1">AI Assistant</div>
                  <div className="text-gray-400">Natural language batch creation</div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center">
              <Link href="/same-chain">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white px-6 py-4 text-lg rounded-full shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 border border-orange-400/20 backdrop-blur-sm">
                  <Sparkles className="mr-3 h-5 w-5" />
                  Start Bundling
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;