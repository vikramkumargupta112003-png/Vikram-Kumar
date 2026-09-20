import React, { useState, useEffect } from 'react';
import { TShirtColour, TShirtSize, ViewAngle, COLOUR_CONFIGS, VariantStock, SIZES } from '../types';
import { STORE_CONFIG, getWhatsAppOrderUrl } from '../data/store';
import { TShirtVisualizer } from '../components/TShirtVisualizer';
import { SizeChartModal } from '../components/SizeChartModal';
import { 
  Heart, 
  ShoppingBag, 
  Zap, 
  MessageCircle, 
  Ruler, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ProductDetailViewProps {
  initialColour?: TShirtColour;
  initialSize?: TShirtSize;
  onAddToCart: (colour: TShirtColour, size: TShirtSize, quantity: number) => void;
  onBuyNow: (colour: TShirtColour, size: TShirtSize, quantity: number) => void;
  onAddToWishlist: (colour: TShirtColour, size: TShirtSize) => void;
  inventory: VariantStock[];
  isMember: boolean;
  onToggleMember: () => void;
}

const ALL_COLOURS: TShirtColour[] = ['Black', 'White', 'Orange', 'Dark Green', 'Pink', 'Yellow'];

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  initialColour = 'Black',
  initialSize = 'L',
  onAddToCart,
  onBuyNow,
  onAddToWishlist,
  inventory,
  isMember,
  onToggleMember
}) => {
  const [selectedColour, setSelectedColour] = useState<TShirtColour>(initialColour);
  const [selectedSize, setSelectedSize] = useState<TShirtSize>(initialSize);
  const [quantity, setQuantity] = useState<number>(1);
  const [viewAngle, setViewAngle] = useState<ViewAngle>('Front');
  const [isSizeChartOpen, setIsSizeChartOpen] = useState<boolean>(false);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  useEffect(() => {
    if (initialColour) setSelectedColour(initialColour);
  }, [initialColour]);

  useEffect(() => {
    if (initialSize) setSelectedSize(initialSize);
  }, [initialSize]);

  const currentVariant = inventory.find(
    (v) => v.colour === selectedColour && v.size === selectedSize
  );
  const availableStock = currentVariant ? currentVariant.stock : 0;
  const isOutOfStock = availableStock <= 0;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > availableStock) return availableStock;
      return next;
    });
  };

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart(selectedColour, selectedSize, quantity);
    setAddedNotice(`Added ${quantity}x ${selectedColour} (${selectedSize}) to Cart`);
    setTimeout(() => setAddedNotice(null), 3500);
  };

  const handleBuy = () => {
    if (isOutOfStock) return;
    onBuyNow(selectedColour, selectedSize, quantity);
  };

  const whatsappUrl = getWhatsAppOrderUrl({
    productName: STORE_CONFIG.productName,
    colour: selectedColour,
    size: selectedSize,
    quantity: quantity
  });

  return (
    <div id="product-detail-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Toast Notification */}
      {addedNotice && (
        <div className="fixed top-20 right-4 z-50 bg-zinc-950 text-white px-5 py-3 rounded-2xl shadow-xl border border-zinc-800 flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{addedNotice}</span>
        </div>
      )}

      {/* Main Product Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        {/* Left Column: Visualizer with 4 view angles (Front, Side, Back, Zoom) */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/90 shadow-sm sticky top-24">
            <TShirtVisualizer
              colour={selectedColour}
              activeAngle={viewAngle}
              onAngleChange={setViewAngle}
              interactive={true}
              sizeTag={selectedSize}
            />

            {/* Angle Selection Tabs */}
            <div className="grid grid-cols-4 gap-2 mt-6 pt-6 border-t border-zinc-100">
              {(['Front', 'Side', 'Back', 'Zoom'] as ViewAngle[]).map((ang) => (
                <button
                  key={ang}
                  id={`pdp-angle-${ang.toLowerCase()}`}
                  type="button"
                  onClick={() => setViewAngle(ang)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
                    viewAngle === ang
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
                  }`}
                >
                  {ang} View
                </button>
              ))}
            </div>

            {/* Genuine Pure Cotton badge */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-600 bg-zinc-50 py-2.5 px-4 rounded-xl border border-zinc-200/80">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Pure Combed Cotton • Bio-Washed • 180 GSM Single Jersey</span>
            </div>
          </div>
        </div>

        {/* Right Column: Product Info, Options & Actions */}
        <div className="lg:col-span-6 space-y-6">
          {/* Title & Brand */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800">
                {STORE_CONFIG.brandName}
              </span>
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Pure Cotton Standard
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 tracking-tight">
              {STORE_CONFIG.productName}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500">
              Classic Comfort Fit • Solid Color • Ribbed Round Crew Neck • No Prints or Graphics
            </p>
          </div>

          {/* Pricing with Clear Member Discount */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-3">
                <span className="text-xs text-zinc-400 line-through">₹499</span>
                <span className="text-3xl font-black text-zinc-950">₹330</span>
                <span className="text-xs text-zinc-500 font-medium">Online Price</span>
              </div>

              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-amber-400 text-zinc-950">
                ₹30 OFF
              </span>
            </div>

            {/* Member price box */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-200/80">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-zinc-900">VIP Member Price:</span>
                <span className="text-base font-extrabold text-emerald-600">₹300</span>
              </div>
              <button
                type="button"
                onClick={onToggleMember}
                className="text-[11px] font-bold text-zinc-700 hover:text-zinc-950 underline"
              >
                {isMember ? 'Membership Active' : 'Activate Member Price'}
              </button>
            </div>
          </div>

          {/* Colour Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-900 uppercase tracking-wider">
                Select Colour: <strong className="text-zinc-950 font-black">{selectedColour}</strong>
              </span>
              <span className="text-zinc-500">6 Solid Shades</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {ALL_COLOURS.map((c) => {
                const cfg = COLOUR_CONFIGS[c];
                const isSelected = selectedColour === c;
                return (
                  <button
                    key={c}
                    id={`pdp-colour-${c.toLowerCase().replace(' ', '-')}`}
                    type="button"
                    onClick={() => setSelectedColour(c)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-zinc-950 bg-zinc-950 text-white shadow-xs font-bold scale-102'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: cfg.hex }}
                    />
                    <span className="text-[11px] truncate w-full">{c}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selector & Size Chart */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-900 uppercase tracking-wider">
                Select Size: <strong className="text-zinc-950 font-black">{selectedSize}</strong>
              </span>

              <button
                id="open-size-guide-btn"
                type="button"
                onClick={() => setIsSizeChartOpen(true)}
                className="inline-flex items-center gap-1 text-zinc-800 hover:text-zinc-950 font-bold underline transition-colors"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Chart & Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {SIZES.map((sz) => {
                const v = inventory.find((it) => it.colour === selectedColour && it.size === sz);
                const sStock = v ? v.stock : 0;
                const isSzOos = sStock <= 0;
                const isSelected = selectedSize === sz;

                return (
                  <button
                    key={sz}
                    id={`pdp-size-${sz}`}
                    type="button"
                    disabled={isSzOos}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-3 px-2 rounded-xl border font-black text-sm flex flex-col items-center transition-all ${
                      isSelected
                        ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm scale-102'
                        : isSzOos
                        ? 'bg-zinc-100 text-zinc-400 border-zinc-200 line-through cursor-not-allowed opacity-60'
                        : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    <span>{sz}</span>
                    <span className="text-[10px] font-normal mt-0.5">
                      {isSzOos ? 'Sold Out' : `${sStock} in stock`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & Stock status */}
          <div className="flex items-center justify-between gap-4 p-3 bg-zinc-50 rounded-2xl border border-zinc-200">
            <div className="text-xs">
              <span className="font-bold text-zinc-700 block">Quantity:</span>
              <span className={`text-[11px] font-semibold ${availableStock > 5 ? 'text-emerald-700' : availableStock > 0 ? 'text-amber-700' : 'text-red-600'}`}>
                {availableStock > 5 ? 'In Stock (Ready to dispatch)' : availableStock > 0 ? `Only ${availableStock} units left!` : 'Variant Out of Stock'}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white rounded-xl border border-zinc-200 p-1">
              <button
                type="button"
                disabled={quantity <= 1 || isOutOfStock}
                onClick={() => handleQuantityChange(-1)}
                className="p-1.5 rounded-lg text-zinc-600 hover:bg-zinc-100 disabled:opacity-30"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center font-bold text-xs text-zinc-950">
                {quantity}
              </span>
              <button
                type="button"
                disabled={quantity >= availableStock || isOutOfStock}
                onClick={() => handleQuantityChange(1)}
                className="p-1.5 rounded-lg text-zinc-600 hover:bg-zinc-100 disabled:opacity-30"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action Buttons: Add to Cart, Buy Now, Add to Wishlist, Order on WhatsApp */}
          <div className="space-y-2.5 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Add to Cart */}
              <button
                id="pdp-add-to-cart-btn"
                type="button"
                disabled={isOutOfStock}
                onClick={handleAdd}
                className={`py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                  isOutOfStock
                    ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed'
                    : 'bg-zinc-950 hover:bg-zinc-800 text-white hover:shadow-md'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
              </button>

              {/* Buy Now */}
              <button
                id="pdp-buy-now-btn"
                type="button"
                disabled={isOutOfStock}
                onClick={handleBuy}
                className={`py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                  isOutOfStock
                    ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                    : 'bg-amber-400 hover:bg-amber-500 text-zinc-950 hover:shadow-md'
                }`}
              >
                <Zap className="w-4 h-4 fill-zinc-950" />
                <span>Buy Now (Instant Checkout)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Add to Wishlist */}
              <button
                id="pdp-wishlist-btn"
                type="button"
                onClick={() => onAddToWishlist(selectedColour, selectedSize)}
                className="py-3 px-4 rounded-xl bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Heart className="w-4 h-4 text-pink-600" />
                <span>Add to Wishlist</span>
              </button>

              {/* Order on WhatsApp */}
              <a
                id="pdp-whatsapp-btn"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Detailed Product Specifications Accordion / Cards */}
          <div className="space-y-3 pt-4 border-t border-zinc-200">
            {/* Description & Fabric */}
            <div className="p-4 bg-white rounded-2xl border border-zinc-200 space-y-2">
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Product & Fabric Description
              </h4>
              <p className="text-xs leading-relaxed text-zinc-600">
                A minimalist wardrobe cornerstone by <strong>{STORE_CONFIG.brandName}</strong>. 
                Engineered with 100% pure combed ring-spun cotton (180 GSM) for a breathable, skin-friendly feel in any weather. 
                The round neck collar features a shape-retaining 1x1 rib with lycra to prevent stretching over repeated wash cycles. 
                Completely plain with zero prints, zero graphics, and zero artificial synthetic fibers.
              </p>
            </div>

            {/* Delivery Information */}
            <div className="p-4 bg-white rounded-2xl border border-zinc-200 space-y-1.5">
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-500" />
                Delivery Information
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                • <strong>Dispatch:</strong> {STORE_CONFIG.dispatchTime}.<br />
                • <strong>Transit:</strong> {STORE_CONFIG.deliveryTime}.<br />
                • <strong>Online Payment:</strong> Fully tracked dispatch with SMS and WhatsApp courier tracking updates.
              </p>
            </div>

            {/* Return & Exchange Information */}
            <div className="p-4 bg-white rounded-2xl border border-zinc-200 space-y-1.5">
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-emerald-500" />
                Return & Exchange Information
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                • Customers can request a return or exchange within <strong>{STORE_CONFIG.returnWindowDays} days of delivery</strong>.<br />
                • Product must be <strong>unused, unwashed, and in original condition</strong> with original tags and packaging.<br />
                • Easily initiate a return or exchange anytime by entering your Order ID and Mobile number on the Track Order page.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Size Chart Modal */}
      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
      />
    </div>
  );
};
