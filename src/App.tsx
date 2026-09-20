import React, { useState, useEffect } from 'react';
import { 
  TShirtColour, 
  TShirtSize, 
  CartItem, 
  WishlistItem, 
  VariantStock, 
  OrderRecord 
} from './types';
import { STORE_CONFIG, INITIAL_VARIANTS } from './data/store';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { SizeChartModal } from './components/SizeChartModal';

// Views
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailView } from './views/ProductDetailView';
import { CartView } from './views/CartView';
import { WishlistView } from './views/WishlistView';
import { CheckoutView } from './views/CheckoutView';
import { OrderSuccessView } from './views/OrderSuccessView';
import { TrackOrderView } from './views/TrackOrderView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { ShippingPolicyView } from './views/ShippingPolicyView';
import { ReturnPolicyView } from './views/ReturnPolicyView';
import { TermsView } from './views/TermsView';
import { PrivacyPolicyView } from './views/PrivacyPolicyView';
import { AdminView } from './views/AdminView';

export const App: React.FC = () => {
  // Navigation
  const [currentView, setCurrentView] = useState<string>('home');
  
  // Selected Product State for Detail page
  const [selectedColour, setSelectedColour] = useState<TShirtColour>('Black');
  const [selectedSize, setSelectedSize] = useState<TShirtSize>('L');

  // Inventory state from server
  const [inventory, setInventory] = useState<VariantStock[]>(INITIAL_VARIANTS);

  // Cart & Wishlist with local storage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ve_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('ve_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // VIP Member Discount State
  const [isMember, setIsMember] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ve_is_member') === 'true';
    } catch {
      return false;
    }
  });

  // Track Order parameters
  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackMobile, setTrackMobile] = useState('');

  // Last completed order
  const [lastOrder, setLastOrder] = useState<OrderRecord | null>(() => {
    try {
      const saved = localStorage.getItem('ve_last_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Size chart modal
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('ve_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Persist wishlist
  useEffect(() => {
    try {
      localStorage.setItem('ve_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Persist member state
  useEffect(() => {
    try {
      localStorage.setItem('ve_is_member', isMember ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
  }, [isMember]);

  // Fetch Inventory from server
  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/inventory');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.inventory) {
          setInventory(data.inventory);
        }
      }
    } catch (err) {
      console.warn('Using local inventory fallback', err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Navigation handler with scroll to top
  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (colour: TShirtColour, size: TShirtSize = 'L') => {
    setSelectedColour(colour);
    setSelectedSize(size);
    handleNavigate('product-detail');
  };

  // Add to Cart
  const handleAddToCart = (colour: TShirtColour, size: TShirtSize, quantity: number = 1) => {
    const existingIndex = cart.findIndex(
      (it) => it.colour === colour && it.size === size
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
    } else {
      const newItem: CartItem = {
        id: `${colour}-${size}-${Date.now()}`,
        colour,
        size,
        quantity,
        unitPrice: STORE_CONFIG.basePrice,
        memberPrice: STORE_CONFIG.memberPrice
      };
      setCart([...cart, newItem]);
    }
  };

  // Buy Now: adds to cart and redirects straight to checkout
  const handleBuyNow = (colour: TShirtColour, size: TShirtSize, quantity: number = 1) => {
    handleAddToCart(colour, size, quantity);
    handleNavigate('checkout');
  };

  // Cart operations
  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter((it) => it.id !== id));
    } else {
      setCart(
        cart.map((it) => (it.id === id ? { ...it, quantity } : it))
      );
    }
  };

  const handleUpdateVariant = (
    id: string,
    newColour: TShirtColour,
    newSize: TShirtSize
  ) => {
    setCart(
      cart.map((it) =>
        it.id === id ? { ...it, colour: newColour, size: newSize } : it
      )
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart(cart.filter((it) => it.id !== id));
  };

  // Wishlist operations
  const handleToggleWishlist = (colour: TShirtColour, size: TShirtSize) => {
    const existingIndex = wishlist.findIndex(
      (it) => it.colour === colour && it.size === size
    );

    if (existingIndex > -1) {
      setWishlist(wishlist.filter((_, idx) => idx !== existingIndex));
    } else {
      const newItem: WishlistItem = {
        id: `wish-${colour}-${size}-${Date.now()}`,
        colour,
        size,
        addedAt: new Date().toISOString()
      };
      setWishlist([...wishlist, newItem]);
    }
  };

  const handleRemoveFromWishlist = (id: string) => {
    setWishlist(wishlist.filter((it) => it.id !== id));
  };

  const handleMoveWishlistToCart = (colour: TShirtColour, size: TShirtSize) => {
    handleAddToCart(colour, size, 1);
    setWishlist(
      wishlist.filter((it) => !(it.colour === colour && it.size === size))
    );
  };

  // Order Success callback
  const handleOrderSuccess = (order: OrderRecord) => {
    setLastOrder(order);
    try {
      localStorage.setItem('ve_last_order', JSON.stringify(order));
    } catch (e) {
      console.error(e);
    }
    // Clear cart
    setCart([]);
    // Update inventory
    fetchInventory();
    handleNavigate('order-success');
  };

  const handleTrackSpecificOrder = (orderId: string, mobile: string) => {
    setTrackOrderId(orderId);
    setTrackMobile(mobile);
    handleNavigate('track-order');
  };

  const totalCartCount = cart.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <div className="min-h-screen bg-stone-50/60 text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      {/* Top Header */}
      {currentView !== 'admin' && (
        <Header
          currentView={currentView}
          cartCount={totalCartCount}
          wishlistCount={wishlist.length}
          isMember={isMember}
          onNavigate={handleNavigate}
          onToggleMember={() => setIsMember(!isMember)}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onAddToWishlist={handleToggleWishlist}
            isMember={isMember}
            onToggleMember={() => setIsMember(!isMember)}
          />
        )}

        {currentView === 'shop' && (
          <ShopView
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onAddToWishlist={handleToggleWishlist}
            inventory={inventory}
            isMember={isMember}
          />
        )}

        {currentView === 'product-detail' && (
          <ProductDetailView
            initialColour={selectedColour}
            initialSize={selectedSize}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onAddToWishlist={handleToggleWishlist}
            inventory={inventory}
            isMember={isMember}
            onToggleMember={() => setIsMember(!isMember)}
          />
        )}

        {currentView === 'cart' && (
          <CartView
            cart={cart}
            inventory={inventory}
            isMember={isMember}
            onUpdateQuantity={handleUpdateQuantity}
            onUpdateVariant={handleUpdateVariant}
            onRemoveItem={handleRemoveCartItem}
            onProceedToCheckout={() => handleNavigate('checkout')}
            onNavigate={handleNavigate}
            onToggleMember={() => setIsMember(!isMember)}
          />
        )}

        {currentView === 'wishlist' && (
          <WishlistView
            wishlist={wishlist}
            inventory={inventory}
            isMember={isMember}
            onMoveToCart={handleMoveWishlistToCart}
            onRemoveFromWishlist={handleRemoveFromWishlist}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutView
            cart={cart}
            inventory={inventory}
            isMember={isMember}
            onOrderSuccess={handleOrderSuccess}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'order-success' && lastOrder && (
          <OrderSuccessView
            order={lastOrder}
            onNavigate={handleNavigate}
            onTrackOrder={handleTrackSpecificOrder}
          />
        )}

        {currentView === 'track-order' && (
          <TrackOrderView
            initialOrderId={trackOrderId}
            initialMobile={trackMobile}
          />
        )}

        {currentView === 'about' && (
          <AboutView onNavigate={handleNavigate} />
        )}

        {currentView === 'contact' && (
          <ContactView />
        )}

        {currentView === 'shipping-policy' && (
          <ShippingPolicyView />
        )}

        {currentView === 'return-policy' && (
          <ReturnPolicyView onNavigate={handleNavigate} />
        )}

        {currentView === 'terms' && (
          <TermsView />
        )}

        {currentView === 'privacy' && (
          <PrivacyPolicyView />
        )}

        {currentView === 'admin' && (
          <AdminView
            onBackToStore={() => handleNavigate('home')}
            onRefreshGlobalInventory={fetchInventory}
          />
        )}
      </main>

      {/* Footer */}
      {currentView !== 'admin' && (
        <Footer onNavigate={handleNavigate} />
      )}

      {/* Floating WhatsApp Quick Action Button */}
      {currentView !== 'admin' && (
        <WhatsAppButton />
      )}

      {/* Reusable Size Chart Modal */}
      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
      />
    </div>
  );
};

export default App;
