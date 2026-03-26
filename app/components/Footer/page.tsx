// app/components/Footer/page.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-600 text-gray-300 border-t border-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Simple test to verify colors */}
        <div className="bg-gray-300 p-4 mb-4 rounded">
          <p className="text-white">If you see this with dark background, Tailwind is working!</p>
        </div>
        
        {/* Your footer content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/features" className="text-gray-400 hover:text-white">Features</Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white">About</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/support" className="text-gray-400 hover:text-white">Support</Link></li>
              <li><Link href="/docs" className="text-gray-400 hover:text-white">Docs</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
          © {currentYear} YourCompany. All rights reserved.
        </div>
      </div>
    </footer>
  );
}