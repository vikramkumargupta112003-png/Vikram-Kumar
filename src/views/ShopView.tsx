import React, { useState } from 'react';
import { TShirtColour, TShirtSize, COLOUR_CONFIGS, VariantStock } from '../types';
import { STORE_CONFIG, getWhatsAppOrderUrl } from '../data/store';
import { TShirtVisualizer } from '../components/TShirtVisualizer';
import { Heart, ShoppingBag, MessageCircle, Filter, Check, ShieldCheck, Zap } from 'lucide-react';

interface ShopViewProps {
  onSelectProduct: (colour: TShirtColour, size?: TShirtSize) => void;
  onAddToCart: (colour: TShirtColour, size: TShirtSize, quantity: number) => void;
  onBuyNow?: (colour: TShirtColour, size: TShirtSize, quantity?: number) => void;
  onAddToWishlist: (colour: TShirtColour, size: TShirtSize) => void;
  inventory: VariantStock[];
  isMember: boolean;
}

const ALL_COLOURS: TShirtColour[] = ['Black', 'White', 'Orange', 'Dark Green', 'Pink', 'Yellow'];
const ALL_SIZES: TShirtSize[] = ['M', 'L', 'XL', 'XXL'];

export const ShopView: React.FC<ShopViewProps> = ({
  onSelectProduct,
  onAddToCart,
  onBuyNow,
  onAddToWishlist,
  inventory,
  isMember
}) => {
  const [selectedColourFilter, setSelectedColourFilter] = useState<string>('All');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('All');
  const [productSizes, setProductSizes] = useState<Record<TShirtColour, TShirtSize>>({
    Black: 'L',
    White: 'L',
    Orange: 'L',
    'Dark Green': 'L',
    Pink: 'L',
    Yellow: 'L'
  });

  const filteredColours = ALL_COLOURS.filter((col) => {
    if (selectedColourFilter !== 'All' && selectedColourFilter !== col) return false;
    return true;
  });

  const getStockForVariant = (col: TShirtColour, sz: TShirtSize): number => {
    const item = inventory.find((v) => v.colour === col && v.size === sz);
    return item ? item.stock : 0;
  };

  const handleSizeChange = (col: TShirtColour, sz: TShirtSize) => {
    setProductSizes((prev) => ({ ...prev, [col]: sz }));
  };

  return (
    <div id="shop-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="border-b border-zinc-200 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-900" />
              Pure Cotton Essentials Collection
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              All Plain Round Neck T-Shirts
            </h1>
            <p className="text-sm text-zinc-600 mt-1 max-w-xl">
              100% Pure Combed Cotton • Bio-Washed • 180 GSM. Solid, unprinted, and designed for lasting comfort.
            </p>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-semibold flex items-center gap-2">
            <span>Online Price: <strong>₹330</strong></span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">
              Member Price: ₹300 (₹30 OFF)
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Colour filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-zinc-600 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Colour:
          </span>
          <button
            type="button"
            onClick={() => setSelectedColourFilter('All')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedColourFilter === 'All'
                ? 'bg-zinc-900 text-white'
                : 'bg-white text-zinc-700 border border-zinc-200 hover:border-zinc-400'
            }`}
          >
            All Colours
          </button>
          {ALL_COLOURS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedColourFilter(c)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedColourFilter === c
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white text-zinc-700 border border-zinc-200 hover:border-zinc-400'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/10"
                style={{ backgroundColor: COLOUR_CONFIGS[c].hex }}
              />
              <span>{c}</span>
            </button>
          ))}
        </div>

        {/* Global size focus filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-600">Size:</span>
          <button
            type="button"
            onClick={() => setSelectedSizeFilter('All')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedSizeFilter === 'All'
                ? 'bg-zinc-900 text-white'
                : 'bg-white text-zinc-700 border border-zinc-200'
            }`}
          >
            All
          </button>
          {ALL_SIZES.map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => {
                setSelectedSizeFilter(sz);
                // Also update default selected size for cards
                const updated: Record<TShirtColour, TShirtSize> = {} as any;
                ALL_COLOURS.forEach((col) => (updated[col] = sz));
                setProductSizes(updated);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedSizeFilter === sz
                  ? 'bg-zinc-900 text-white'
                  : 'bg-white text-zinc-700 border border-zinc-200'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredColours.map((col) => {
          const cfg = COLOUR_CONFIGS[col];
          const chosenSize = productSizes[col] || 'L';
          const stock = getStockForVariant(col, chosenSize);
          const isOutOfStock = stock <= 0;

          const whatsappLink = getWhatsAppOrderUrl({
            productName: STORE_CONFIG.productName,
            colour: col,
            size: chosenSize,
            quantity: 1
          });

          return (
            <div
              key={col}
              id={`shop-item-${col.toLowerCase().replace(' ', '-')}`}
              className="bg-white rounded-2xl border border-zinc-200/90 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden"
            >
              {/* Image Preview & Click to details */}
              <div 
                className="relative p-6 pb-2 bg-zinc-50/70 cursor-pointer"
                onClick={() => onSelectProduct(col, chosenSize)}
              >
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 shadow-xs border border-zinc-200 text-xs font-bold text-zinc-900">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/10"
                    style={{ backgroundColor: cfg.hex }}
                  />
                  {col}
                </div>

                <button
                  type="button"
                  title="Add to Wishlist"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToWishlist(col, chosenSize);
                  }}
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/95 shadow-xs border border-zinc-200 text-zinc-600 hover:text-pink-600 hover:scale-110 transition-all"
                >
                  <Heart className="w-4 h-4" />
                </button>

                <div className="py-2">
                  <TShirtVisualizer colour={col} interactive={false} />
                </div>
              </div>

              {/* Details & Actions */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 
                      onClick={() => onSelectProduct(col, chosenSize)}
                      className="text-base font-extrabold text-zinc-950 hover:text-zinc-700 cursor-pointer"
                    >
                      Plain Round Neck T-Shirt
                    </h3>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800">
                      {col}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{cfg.description}</p>

                  {/* Pricing breakdown */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100">
                    <div>
                      <span className="text-xs text-zinc-400 line-through mr-1.5">₹499</span>
                      <span className="text-lg font-black text-zinc-950">₹330</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-400 text-zinc-950 uppercase">
                        ₹30 OFF
                      </span>
                      <div className="text-xs font-bold text-emerald-600">
                        Member: ₹300
                      </div>
                    </div>
                  </div>
                </div>

                {/* Size Choice with Stock Status */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-600">Size:</span>
                    <span className={`text-[11px] font-semibold ${stock > 10 ? 'text-emerald-700' : stock > 0 ? 'text-amber-700' : 'text-red-600'}`}>
                      {stock > 10 ? `In Stock (${stock} available)` : stock > 0 ? `Only ${stock} left!` : 'Out of Stock'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {ALL_SIZES.map((sz) => {
                      const szStock = getStockForVariant(col, sz);
                      const isSzOos = szStock <= 0;
                      return (
                        <button
                          key={sz}
                          type="button"
                          disabled={isSzOos}
                          onClick={() => handleSizeChange(col, sz)}
                          className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                            chosenSize === sz
                              ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                              : isSzOos
                              ? 'bg-zinc-100 text-zinc-400 border-zinc-200 line-through cursor-not-allowed'
                              : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Primary Action Buttons: Add to Cart & Buy Now */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => onAddToCart(col, chosenSize, 1)}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                      isOutOfStock
                        ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-zinc-700" />
                    <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => onBuyNow ? onBuyNow(col, chosenSize, 1) : onAddToCart(col, chosenSize, 1)}
                    className={`w-full py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs ${
                      isOutOfStock
                        ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed'
                        : 'bg-amber-400 hover:bg-amber-300 text-zinc-950'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>{isOutOfStock ? 'Unavailable' : 'Buy Now'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
