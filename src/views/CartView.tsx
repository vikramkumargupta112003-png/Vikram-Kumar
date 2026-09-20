import React from 'react';
import { CartItem, VariantStock, COLOUR_CONFIGS, TShirtColour, TShirtSize, SIZES } from '../types';
import { STORE_CONFIG } from '../data/store';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Sparkles, ShoppingBag } from 'lucide-react';

interface CartViewProps {
  cart: CartItem[];
  inventory: VariantStock[];
  isMember: boolean;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onUpdateVariant: (id: string, newColour: TShirtColour, newSize: TShirtSize) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  onNavigate: (view: string) => void;
  onToggleMember: () => void;
}

const ALL_COLOURS: TShirtColour[] = ['Black', 'White', 'Orange', 'Dark Green', 'Pink', 'Yellow'];

export const CartView: React.FC<CartViewProps> = ({
  cart,
  inventory,
  isMember,
  onUpdateQuantity,
  onUpdateVariant,
  onRemoveItem,
  onProceedToCheckout,
  onNavigate,
  onToggleMember
}) => {
  const getStock = (col: TShirtColour, sz: TShirtSize): number => {
    const v = inventory.find((it) => it.colour === col && it.size === sz);
    return v ? v.stock : 0;
  };

  const totalQuantity = cart.reduce((sum, it) => sum + it.quantity, 0);
  const baseSubtotal = totalQuantity * STORE_CONFIG.basePrice; // ₹330
  const memberDiscount = isMember ? totalQuantity * STORE_CONFIG.memberDiscount : 0; // ₹30 per unit
  const shipping = 0; // Free delivery for online prepaid orders
  const finalTotal = baseSubtotal - memberDiscount + shipping;

  // Check if any cart item exceeds current inventory stock
  const stockErrors: string[] = [];
  cart.forEach((item) => {
    const stock = getStock(item.colour, item.size);
    if (item.quantity > stock) {
      stockErrors.push(
        `${item.colour} (${item.size}) has only ${stock} units available (in cart: ${item.quantity}).`
      );
    }
  });

  const hasStockError = stockErrors.length > 0;

  if (cart.length === 0) {
    return (
      <div id="empty-cart-view" className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-zinc-950">Your Shopping Cart is Empty</h2>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            Discover our collection of 100% pure combed cotton plain round neck t-shirts available in 6 solid shades.
          </p>
        </div>
        <button
          id="cart-empty-shop-btn"
          type="button"
          onClick={() => onNavigate('shop')}
          className="px-8 py-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-sm transition-all shadow-sm inline-flex items-center gap-2"
        >
          <span>Shop Plain T-Shirts</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div id="cart-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="border-b border-zinc-200 pb-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
            Shopping Cart ({totalQuantity} {totalQuantity === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-zinc-500">
            Plain Round Neck T-Shirts • 100% Pure Combed Cotton
          </p>
        </div>

        {/* Member Discount Toggle reminder */}
        <div className="p-2.5 px-4 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-zinc-900">Member Privilege: </span>
            <span className="text-emerald-700 font-extrabold">₹30 OFF per T-shirt</span>
          </div>
          <button
            type="button"
            onClick={onToggleMember}
            className="text-xs font-bold text-zinc-900 underline hover:text-zinc-700"
          >
            {isMember ? 'Active' : 'Apply'}
          </button>
        </div>
      </div>

      {/* Stock warning if any */}
      {hasStockError && (
        <div className="p-4 mb-6 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium space-y-1">
          <div className="font-bold">Stock Adjustment Required:</div>
          {stockErrors.map((err, i) => (
            <div key={i}>• {err}</div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => {
            const cfg = COLOUR_CONFIGS[item.colour];
            const stock = getStock(item.colour, item.size);

            return (
              <div
                key={item.id}
                id={`cart-item-${item.id}`}
                className="p-5 bg-white rounded-2xl border border-zinc-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Left: Swatch & Info */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-xl border border-zinc-200 flex items-center justify-center relative shrink-0 shadow-inner"
                    style={{ backgroundColor: cfg.hex }}
                  >
                    <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-black/40 text-white backdrop-blur-xs">
                      {item.size}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-zinc-950">
                      Plain Round Neck T-Shirt
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-600">
                      <span>Colour: <strong>{item.colour}</strong></span>
                      <span>•</span>
                      <span>Size: <strong>{item.size}</strong></span>
                    </div>

                    {/* Change colour or size in-place */}
                    <div className="flex items-center gap-2 pt-1 text-xs">
                      <select
                        value={item.colour}
                        onChange={(e) =>
                          onUpdateVariant(item.id, e.target.value as TShirtColour, item.size)
                        }
                        className="py-1 px-2 text-xs font-semibold rounded-lg border border-zinc-200 bg-zinc-50"
                      >
                        {ALL_COLOURS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>

                      <select
                        value={item.size}
                        onChange={(e) =>
                          onUpdateVariant(item.id, item.colour, e.target.value as TShirtSize)
                        }
                        className="py-1 px-2 text-xs font-semibold rounded-lg border border-zinc-200 bg-zinc-50"
                      >
                        {SIZES.map((sz) => (
                          <option key={sz} value={sz}>
                            {sz}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="text-[11px] text-zinc-500">
                      Available stock: {stock} units
                    </div>
                  </div>
                </div>

                {/* Right: Quantity, Pricing & Delete */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                  {/* Price */}
                  <div className="text-right">
                    <div className="text-xs text-zinc-400 line-through">
                      ₹{STORE_CONFIG.basePrice * item.quantity}
                    </div>
                    <div className="text-base font-black text-zinc-950">
                      ₹{isMember
                        ? STORE_CONFIG.memberPrice * item.quantity
                        : STORE_CONFIG.basePrice * item.quantity}
                    </div>
                    {isMember && (
                      <div className="text-[11px] text-emerald-700 font-bold">
                        Member Saved ₹{STORE_CONFIG.memberDiscount * item.quantity}
                      </div>
                    )}
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-zinc-200 rounded-lg p-0.5 bg-zinc-50">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-zinc-600 hover:text-zinc-950"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-zinc-600 hover:text-zinc-950"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      title="Remove item"
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Box */}
        <div className="lg:col-span-4">
          <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-200/90 shadow-sm space-y-5 sticky top-24">
            <h3 className="text-base font-extrabold text-zinc-950 border-b border-zinc-200 pb-3">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Total Items</span>
                <span className="font-bold text-zinc-900">{totalQuantity}</span>
              </div>

              <div className="flex justify-between">
                <span>Subtotal (Online Price @ ₹{STORE_CONFIG.basePrice})</span>
                <span className="font-bold text-zinc-900">₹{baseSubtotal}</span>
              </div>

              <div className="flex justify-between text-emerald-700">
                <span>Member Discount (₹30 OFF/item)</span>
                <span className="font-bold">
                  {isMember ? `-₹${memberDiscount}` : '₹0'}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Tracked Courier Delivery</span>
                <span className="font-bold text-emerald-700">FREE</span>
              </div>

              <div className="pt-3 border-t border-zinc-200 flex justify-between text-sm font-black text-zinc-950">
                <span>Final Total Amount</span>
                <span className="text-xl font-black text-zinc-950">₹{finalTotal}</span>
              </div>
            </div>

            {/* Payment & Security Notice */}
            <div className="p-3 bg-white rounded-xl border border-zinc-200 text-xs text-zinc-600 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-zinc-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Online Payment Ready</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Securely pay using UPI (GPay, PhonePe, Paytm), Debit/Credit Cards, NetBanking, or Wallets at Checkout.
              </p>
            </div>

            {/* Checkout Button */}
            <button
              id="proceed-to-checkout-btn"
              type="button"
              disabled={hasStockError}
              onClick={onProceedToCheckout}
              className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                hasStockError
                  ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed'
                  : 'bg-zinc-950 hover:bg-zinc-800 text-white hover:shadow-lg'
              }`}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('shop')}
              className="w-full text-center text-xs font-semibold text-zinc-600 hover:text-zinc-950"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
