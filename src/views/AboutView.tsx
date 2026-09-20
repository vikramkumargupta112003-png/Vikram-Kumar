import React from 'react';
import { STORE_CONFIG } from '../data/store';
import { ShieldCheck, Heart, Award, ArrowRight, Sparkles } from 'lucide-react';

interface AboutViewProps {
  onNavigate: (view: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div id="about-view" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 text-xs font-bold uppercase tracking-wider">
          Brand Heritage
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight">
          About {STORE_CONFIG.brandName}
        </h1>
        <p className="text-base text-zinc-600 max-w-xl mx-auto">
          Dedicated purely to crafting the highest standard of plain round neck t-shirts.
        </p>
      </div>

      {/* Main Philosophy */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200/90 shadow-sm space-y-6 text-sm leading-relaxed text-zinc-700">
        <div className="space-y-3">
          <h2 className="text-xl font-extrabold text-zinc-950">
            Why Sell ONLY Plain Round Neck T-Shirts?
          </h2>
          <p>
            At <strong>{STORE_CONFIG.brandName}</strong>, we believe that modern closets are overcrowded with fast fashion, loud graphics, and synthetic polyester blends that degrade after just a few washes.
          </p>
          <p>
            We made a deliberate, uncompromising choice: <em>to do exactly one thing, and do it better than anyone else</em>. We manufacture and sell strictly <strong>Plain Round Neck T-Shirts</strong> in six timeless, versatile solid colours: Black, White, Orange, Dark Green, Pink, and Yellow.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-100">
          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-zinc-900 text-xs uppercase tracking-wider">100% Pure Cotton</h3>
            <p className="text-xs text-zinc-600">
              Only 100% combed cotton yarn. Zero synthetic polyester, zero cheap poly-blends. Breathable and gentle on all skin types.
            </p>
          </div>

          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-2">
            <Award className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-zinc-900 text-xs uppercase tracking-wider">180 GSM Bio-Washed</h3>
            <p className="text-xs text-zinc-600">
              The sweet spot of everyday durability and lightness. Bio-washed with natural enzymes for an ultra-soft hand feel.
            </p>
          </div>

          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 space-y-2">
            <Heart className="w-5 h-5 text-pink-600" />
            <h3 className="font-bold text-zinc-900 text-xs uppercase tracking-wider">Anti-Sag Collar</h3>
            <p className="text-xs text-zinc-600">
              Our round neck ribbing is constructed with a 1x1 Lycra blend rib that snaps back into shape and prevents neckline drooping.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-zinc-100">
          <h2 className="text-lg font-extrabold text-zinc-950">
            Fair Pricing & Online Transparency
          </h2>
          <p>
            By operating purely on online prepaid transactions, we eliminate fraudulent non-deliveries, fake bookings, and unnecessary middleman margins. This allows us to provide an online payment price of just <strong>₹330</strong>, with an automatic VIP Member price of <strong>₹300</strong> (₹30 OFF) directly to our customers.
          </p>
        </div>

        <div className="pt-4 flex justify-center">
          <button
            type="button"
            onClick={() => onNavigate('shop')}
            className="px-8 py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
