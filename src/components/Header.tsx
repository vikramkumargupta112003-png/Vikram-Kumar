import React, { useState } from 'react';
import { ShoppingBag, Heart, Menu, X, ShieldCheck, Sparkles, Truck, Lock } from 'lucide-react';
import { STORE_CONFIG } from '../data/store';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  cartCount: number;
  wishlistCount: number;
  isMember: boolean;
  onToggleMember: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  cartCount,
  wishlistCount,
  isMember,
  onToggleMember
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop T-Shirts' },
    { id: 'track-order', label: 'Track Order' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact Us' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
      {/* Top Announcement Bar - Clear online payment & member discount callout */}
      <div className="bg-zinc-950 text-white text-[11px] sm:text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Pure Cotton
            </span>
            <span className="text-zinc-600 hidden md:inline">•</span>
            <span className="text-amber-300 font-semibold">
              Member Price ₹300 (₹30 OFF)
            </span>
            <span className="text-zinc-600 hidden md:inline">•</span>
            <span className="text-zinc-300 hidden md:inline">
              Prepaid Online Orders Only
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="header-member-toggle-btn"
              type="button"
              onClick={onToggleMember}
              className={`text-[11px] px-2 py-0.5 rounded-full transition-all flex items-center gap-1 ${
                isMember 
                  ? 'bg-amber-400 text-zinc-950 font-bold' 
                  : 'bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              {isMember ? 'VIP Member (₹30 OFF Active)' : 'Join Member (Save ₹30)'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Mobile menu toggle */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 rounded-lg text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo & Name */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <button
              id="brand-logo-btn"
              type="button"
              onClick={() => onNavigate('home')}
              className="text-left group inline-block"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-black text-sm tracking-wider shadow-xs">
                  VE
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-zinc-950 uppercase">
                    {STORE_CONFIG.brandName}
                  </h1>
                  <p className="text-[10px] font-semibold text-zinc-600 tracking-wider uppercase -mt-0.5">
                    Plain Round Neck Tees
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                type="button"
                onClick={() => onNavigate(link.id)}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  currentView === link.id
                    ? 'bg-zinc-100 text-zinc-950 font-bold'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Wishlist Button */}
            <button
              id="header-wishlist-btn"
              type="button"
              onClick={() => onNavigate('wishlist')}
              className="relative p-2 rounded-xl text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
              title="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-pink-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="header-cart-btn"
              type="button"
              onClick={() => onNavigate('cart')}
              className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-colors shadow-xs"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-400 text-zinc-950 text-[11px] font-black rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Subtle Admin Icon */}
            <button
              id="header-admin-btn"
              type="button"
              onClick={() => onNavigate('admin')}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors hidden sm:block"
              title="Admin Portal"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              id={`mobile-nav-${link.id}`}
              type="button"
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                currentView === link.id
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              {link.label}
            </button>
          ))}
          
          <div className="pt-2 border-t border-zinc-100 flex items-center justify-between px-2">
            <button
              type="button"
              onClick={() => {
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 py-1"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
            <div className="text-xs text-emerald-600 font-medium">
              100% Pure Cotton Plain Tees
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
