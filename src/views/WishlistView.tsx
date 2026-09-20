import React from 'react';
import { WishlistItem, VariantStock, COLOUR_CONFIGS } from '../types';
import { STORE_CONFIG } from '../data/store';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

interface WishlistViewProps {
  wishlist: WishlistItem[];
  inventory: VariantStock[];
  isMember: boolean;
  onMoveToCart: (colour: any, size: any) => void;
  onRemoveFromWishlist: (id: string) => void;
  onNavigate: (view: string) => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  wishlist,
  inventory,
  isMember,
  onMoveToCart,
  onRemoveFromWishlist,
  onNavigate
}) => {
  const getStock = (col: string, sz: string): number => {
    const v = inventory.find((it) => it.colour === col && it.size === sz);
    return v ? v.stock : 0;
  };

  if (wishlist.length === 0) {
    return (
      <div id="empty-wishlist-view" className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-pink-50 flex items-center justify-center text-pink-500">
          <Heart className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-zinc-950">Your Wishlist is Empty</h2>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            Save your favourite plain round neck t-shirt colours and sizes here to easily order later.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('shop')}
          className="px-8 py-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-sm transition-all shadow-sm inline-flex items-center gap-2"
        >
          <span>Explore Plain T-Shirts</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div id="wishlist-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="border-b border-zinc-200 pb-5 mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
          My Saved Wishlist ({wishlist.length} {wishlist.length === 1 ? 'item' : 'items'})
        </h1>
        <p className="text-xs text-zinc-500">
          100% Pure Combed Cotton Plain Round Neck Essentials
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => {
          const cfg = COLOUR_CONFIGS[item.colour];
          const stock = getStock(item.colour, item.size);
          const isOutOfStock = stock <= 0;

          return (
            <div
              key={item.id}
              id={`wishlist-item-${item.id}`}
              className="bg-white rounded-2xl border border-zinc-200/90 shadow-xs p-5 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-xl border border-zinc-200 flex items-center justify-center shrink-0 shadow-inner"
                  style={{ backgroundColor: cfg.hex }}
                >
                  <span className="text-xs font-black px-1.5 py-0.5 rounded bg-black/40 text-white backdrop-blur-xs">
                    {item.size}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-zinc-950">
                    Plain Round Neck T-Shirt
                  </h3>
                  <div className="text-xs text-zinc-600">
                    Colour: <strong>{item.colour}</strong> • Size: <strong>{item.size}</strong>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-sm font-black text-zinc-950">
                      ₹{isMember ? STORE_CONFIG.memberPrice : STORE_CONFIG.basePrice}
                    </span>
                    {isMember && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-200 text-amber-950">
                        VIP ₹{STORE_CONFIG.memberPrice}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-medium text-zinc-500">
                    {isOutOfStock ? (
                      <span className="text-red-600 font-bold">Currently Out of Stock</span>
                    ) : (
                      <span className="text-emerald-700">{stock} units in stock</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => onMoveToCart(item.colour, item.size)}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs ${
                    isOutOfStock
                      ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                      : 'bg-zinc-950 hover:bg-zinc-800 text-white'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </button>

                <button
                  type="button"
                  title="Remove from wishlist"
                  onClick={() => onRemoveFromWishlist(item.id)}
                  className="p-2.5 rounded-xl border border-zinc-200 text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
