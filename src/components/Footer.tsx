import React from 'react';
import { STORE_CONFIG } from '../data/store';
import { ShieldCheck, Truck, RotateCcw, CreditCard, Lock, MessageCircle } from 'lucide-react';
import { getWhatsAppOrderUrl } from '../data/store';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const whatsappUrl = getWhatsAppOrderUrl({
    customMessage: 'Hi VIKRAM ENTERPRESSES, I have a question regarding your plain round neck t-shirts.'
  });

  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-14 pb-12 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Propositions Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-zinc-800">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">100% Pure Cotton</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                180 GSM bio-washed combed cotton. No polyester blend, ultra-soft, and pre-shrunk.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white shrink-0">
              <CreditCard className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">Online Payment Only</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Secure prepaid UPI, Cards, and NetBanking with bank-grade encryption.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white shrink-0">
              <RotateCcw className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">7-Day Easy Exchange</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Unused, unwashed items can be exchanged or returned within 7 days of delivery.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white shrink-0">
              <Truck className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">Tracked Dispatch</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Dispatched in 24-48 business hours with live courier tracking nationwide.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 border-b border-zinc-800">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white text-zinc-950 flex items-center justify-center font-black text-sm">
                VE
              </div>
              <h3 className="text-base font-extrabold text-white tracking-tight uppercase">
                {STORE_CONFIG.brandName}
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-zinc-400">
              Dedicated purely to crafting the highest standard of plain round neck t-shirts. 
              No prints, no logos, no graphics—just genuine comfort and essential style.
            </p>
            <div className="pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Support</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Shop & Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('shop')}
                  className="hover:text-white transition-colors"
                >
                  Shop All 6 Colours
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('cart')}
                  className="hover:text-white transition-colors"
                >
                  Shopping Cart
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('wishlist')}
                  className="hover:text-white transition-colors"
                >
                  My Wishlist
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('track-order')}
                  className="hover:text-white transition-colors font-medium text-amber-400"
                >
                  Track Your Order
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              About & Assistance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  About Our Brand
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact Customer Care
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('track-order')}
                  className="hover:text-white transition-colors"
                >
                  Request Return / Exchange
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="hover:text-white transition-colors flex items-center gap-1 text-zinc-500"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Dashboard</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Store Policies */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Store Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('shipping-policy')}
                  className="hover:text-white transition-colors"
                >
                  Shipping & Delivery Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('return-policy')}
                  className="hover:text-white transition-colors"
                >
                  7-Day Return & Exchange Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('terms')}
                  className="hover:text-white transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Payment & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div>
            © 2026 <strong className="text-zinc-200 uppercase">{STORE_CONFIG.brandName}</strong>. All rights reserved.
          </div>

          <div className="flex items-center gap-2 text-zinc-400">
            <span>Accepted Payment:</span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 font-semibold">UPI</span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 font-semibold">Cards</span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 font-semibold">NetBanking</span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 font-semibold">Wallets</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
