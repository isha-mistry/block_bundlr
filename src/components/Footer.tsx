'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Github, Twitter, Mail, Shield, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white/5 backdrop-blur-2xl border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-gray-400 modern-text text-sm">
          © 2025 BlockBundlR. All rights reserved. Powered by RIF.
        </div>
      </div>
    </footer>
  );
}
