import React, { useState } from 'react';
import { TShirtColour, COLOUR_CONFIGS, TShirtSize } from '../types';
import { STORE_CONFIG, getWhatsAppOrderUrl } from '../data/store';
import { TShirtVisualizer } from '../components/TShirtVisualizer';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Heart, 
  ShoppingBag, 
  MessageCircle, 
  RotateCcw,
  Truck,
  CreditCard,
  Zap
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onSelectProduct: (colour: TShirtColour, size?: TShirtSize) => void;
  onAddToCart: (colour: TShirtColour, size: TShirtSize, quantity: number) => void;
  onBuyNow: (colour: TShirtColour, size: TShirtSize, quantity?: number) => void;
  onAddToWishlist: (colour: TShirtColour, size: TShirtSize) => void;
  isMember: boolean;
  onToggleMember: () => void;
}

const ALL_COLOURS: TShirtColour[] = ['Black', 'White', 'Orange', 'Dark Green', 'Pink', 'Yellow'];

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onSelectProduct,
  onAddToCart,
  onBuyNow,
  onAddToWishlist,
  isMember,
  onToggleMember
}) => {
  const [heroColour, setHeroColour] = useState<TShirtColour>('Black');
  const [selectedQuickSizes, setSelectedQuickSizes] = useState<Record<TShirtColour, TShirtSize>>({
    Black: 'L',
    White: 'L',
    Orange: 'L',
    'Dark Green': 'L',
    Pink: 'L',
    Yellow: 'L'
  });

  const handleQuickSizeChange = (col: TShirtColour, sz: TShirtSize) => {
    setSelectedQuickSizes((prev) => ({ ...prev, [col]: sz }));
  };

  return (
    <div id="home-view" className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20 border-b border-zinc-200/80 bg-gradient-to-b from-zinc-50/70 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-900 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                100% Pure Combed Cotton • Solid Plain
              </div>

              {/* Exact Hero Heading & Subheading from prompt */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-950 tracking-tight leading-[1.1]">
                Simple Style.<br />Everyday Comfort.
              </h1>

              <p className="text-base sm:text-lg text-zinc-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Premium Plain Round Neck T-Shirts made for comfortable everyday wear.
              </p>

              {/* Pricing Callout with Member Discount */}
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200/90 inline-block text-left w-full max-w-md shadow-xs">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div>
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                      Online Payment Price
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-zinc-950">
                      ₹{STORE_CONFIG.basePrice}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-400 text-zinc-950">
                      ₹{STORE_CONFIG.memberDiscount} OFF
                    </span>
                    <div className="text-sm font-bold text-emerald-600 mt-1">
                      Member Price: ₹{STORE_CONFIG.memberPrice}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-zinc-200 text-zinc-600">
                  <span>No hidden charges</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5" />
                    Online Payment Only
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  id="hero-shop-btn"
                  type="button"
                  onClick={() => onNavigate('shop')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                >
                  <span>Shop T-Shirts</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  id="hero-view-details-btn"
                  type="button"
                  onClick={() => onSelectProduct(heroColour)}
                  className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-300 font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <span>View Details ({heroColour})</span>
                </button>
              </div>

              {/* Colour quick pills under hero */}
              <div className="pt-2">
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                  Preview 6 Plain Colours:
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2.5 flex-wrap">
                  {ALL_COLOURS.map((col) => {
                    const cfg = COLOUR_CONFIGS[col];
                    const isSelected = heroColour === col;
                    return (
                      <button
                        key={col}
                        id={`hero-col-${col.toLowerCase().replace(' ', '-')}`}
                        type="button"
                        onClick={() => setHeroColour(col)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
                          isSelected
                            ? 'border-zinc-950 bg-zinc-950 text-white shadow-xs scale-105'
                            : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: cfg.hex }}
                        />
                        <span>{col}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Hero Right Visualizer with 4 view angles */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/90 shadow-lg">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
                  <div>
                    <h3 className="text-base font-extrabold text-zinc-950">
                      Plain Round Neck T-Shirt
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Colour: <strong className="text-zinc-800">{heroColour}</strong> • Solid Dye
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-zinc-950">₹330</div>
                    <div className="text-[11px] font-bold text-amber-600">Member: ₹300</div>
                  </div>
                </div>

                <TShirtVisualizer colour={heroColour} interactive={true} />

                <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600">
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    100% Pure Cotton
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Zero Polyester
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Anti-Sag Neck
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase: All Six Colours Section */}
      <section id="six-colours-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 text-xs font-bold uppercase tracking-wider">
            Curated Palette
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
            Six Timeless Solid Colours
          </h2>
          <p className="text-sm sm:text-base text-zinc-600">
            Carefully dyed on 100% pure combed cotton yarn for deep saturation, breathability, and zero fading.
          </p>
        </div>

        {/* 6 Colours Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {ALL_COLOURS.map((col) => {
            const cfg = COLOUR_CONFIGS[col];
            const currentSize = selectedQuickSizes[col] || 'L';
            const whatsappLink = getWhatsAppOrderUrl({
              productName: STORE_CONFIG.productName,
              colour: col,
              size: currentSize,
              quantity: 1
            });

            return (
              <div
                key={col}
                id={`product-card-${col.toLowerCase().replace(' ', '-')}`}
                className="group relative bg-white rounded-2xl border border-zinc-200/90 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Visualizer header */}
                <div className="relative p-5 pb-2 bg-zinc-50/60 cursor-pointer" onClick={() => onSelectProduct(col, currentSize)}>
                  {/* Colour Badge */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 shadow-xs border border-zinc-200 text-xs font-bold text-zinc-900">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: cfg.hex }}
                    />
                    {col}
                  </div>

                  {/* Wishlist quick action */}
                  <button
                    id={`wishlist-quick-${col.toLowerCase().replace(' ', '-')}`}
                    type="button"
                    title="Add to Wishlist"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToWishlist(col, currentSize);
                    }}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/95 shadow-xs border border-zinc-200 text-zinc-600 hover:text-pink-600 hover:scale-110 transition-all"
                  >
                    <Heart className="w-4 h-4" />
                  </button>

                  <div className="py-2">
                    <TShirtVisualizer
                      colour={col}
                      interactive={false}
                      className="w-full max-w-[280px] mx-auto"
                    />
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 pt-3 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        onClick={() => onSelectProduct(col, currentSize)}
                        className="text-base font-extrabold text-zinc-950 group-hover:text-zinc-700 transition-colors cursor-pointer"
                      >
                        Plain Round Neck T-Shirt
                      </h3>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                        {col}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-1">
                      {cfg.description}
                    </p>

                    {/* Pricing display: ₹330, ₹30 OFF, Member ₹300 */}
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-zinc-100">
                      <div>
                        <span className="text-xs text-zinc-500 line-through block">₹499</span>
                        <span className="text-lg font-black text-zinc-950">₹330</span>
                      </div>
                      <div className="h-6 w-px bg-zinc-200" />
                      <div>
                        <span className="inline-block text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 uppercase">
                          ₹30 OFF
                        </span>
                        <div className="text-xs font-bold text-emerald-600 mt-0.5">
                          Member: ₹300
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Size Selector */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-600">
                      <span>Select Size:</span>
                      <span className="text-zinc-900 font-bold">{currentSize}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['M', 'L', 'XL', 'XXL'] as TShirtSize[]).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          id={`quick-size-${col.toLowerCase().replace(' ', '-')}-${sz}`}
                          onClick={() => handleQuickSizeChange(col, sz)}
                          className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                            currentSize === sz
                              ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                              : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions: Add to Cart & Buy Now */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      id={`add-cart-quick-${col.toLowerCase().replace(' ', '-')}`}
                      type="button"
                      onClick={() => onAddToCart(col, currentSize, 1)}
                      className="w-full py-2.5 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-zinc-700" />
                      <span>Add to Cart</span>
                    </button>

                    <button
                      id={`buy-now-${col.toLowerCase().replace(' ', '-')}`}
                      type="button"
                      onClick={() => onBuyNow(col, currentSize, 1)}
                      className="w-full py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>Buy Now</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Fabric & Quality Specifications Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-zinc-900 text-white rounded-3xl p-8 sm:p-12 border border-zinc-800 shadow-xl overflow-hidden relative">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Fabric Blueprint
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              100% Pure Cotton. Zero Gimmicks.
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Every single T-Shirt by <strong>VIKRAM ENTERPRESSES</strong> is knit from 100% pure combed ring-spun cotton. 
              We strictly do not manufacture prints, logos, or artificial graphics. Our focus is 100% on fabric weight, durable stitching, collar integrity, and pure everyday comfort.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-zinc-800">
              <div>
                <span className="text-2xl font-black text-white block">180 GSM</span>
                <span className="text-xs text-zinc-400">Ideal all-season weight</span>
              </div>
              <div>
                <span className="text-2xl font-black text-white block">Bio-Washed</span>
                <span className="text-xs text-zinc-400">Ultra-soft hand feel</span>
              </div>
              <div>
                <span className="text-2xl font-black text-white block">Anti-Sag</span>
                <span className="text-xs text-zinc-400">1x1 Rib Lycra Neckband</span>
              </div>
              <div>
                <span className="text-2xl font-black text-white block">Pre-Shrunk</span>
                <span className="text-xs text-zinc-400">Zero shape alteration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VIP Membership Banner (₹30 OFF) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full uppercase">
              Member Privilege
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-950">
              Instant ₹30 OFF On Every Single T-Shirt
            </h3>
            <p className="text-sm text-zinc-700 max-w-xl">
              Become a VIP member with one click. Enjoy the member price of <strong>₹300</strong> instead of ₹330 on all orders with zero annual fee.
            </p>
          </div>

          <button
            id="home-member-toggle-btn"
            type="button"
            onClick={onToggleMember}
            className={`px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm shrink-0 ${
              isMember
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-zinc-950 text-white hover:bg-zinc-800'
            }`}
          >
            {isMember ? '✓ VIP Membership Active' : 'Activate ₹30 Member Discount'}
          </button>
        </div>
      </section>
    </div>
  );
};
