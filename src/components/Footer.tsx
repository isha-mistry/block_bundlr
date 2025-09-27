'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Github, Twitter, Mail, Shield, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white/5 backdrop-blur-2xl border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-400 modern-text text-sm">
            © 2025 BlockBundlR. All rights reserved. Powered by RIF.
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 modern-text">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 modern-text">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 modern-text">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
