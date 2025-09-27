'use client';

import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="pb-8 px-6 w-full">
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-lg rounded-full px-8 py-4">
        <div className="text-center text-gray-400 modern-text text-sm flex items-center justify-center space-x-2">
          <span>Made with</span>
          <Heart className="w-4 h-4 text-orange-400 fill-current" />
          <span>by BlockBundlR Team</span>
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span className="hidden sm:inline">Powered by RIF</span>
        </div>
      </div>
    </footer>
  );
}
