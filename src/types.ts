export type TShirtColour = 'Black' | 'White' | 'Orange' | 'Dark Green' | 'Pink' | 'Yellow';
export type TShirtSize = 'M' | 'L' | 'XL' | 'XXL';
export type ViewAngle = 'Front' | 'Side' | 'Back' | 'Zoom';

export interface ColourConfig {
  name: TShirtColour;
  hex: string;
  badgeBg: string;
  textColor: string;
  description: string;
}

export const COLOUR_CONFIGS: Record<TShirtColour, ColourConfig> = {
  Black: {
    name: 'Black',
    hex: '#18181B',
    badgeBg: 'bg-zinc-900',
    textColor: 'text-white',
    description: 'Deep Jet Black - timeless, versatile and effortlessly sharp'
  },
  White: {
    name: 'White',
    hex: '#F8FAFC',
    badgeBg: 'bg-white border border-zinc-300',
    textColor: 'text-zinc-900',
    description: 'Crisp Pure White - pristine, breathable everyday foundation'
  },
  Orange: {
    name: 'Orange',
    hex: '#EA580C',
    badgeBg: 'bg-orange-600',
    textColor: 'text-white',
    description: 'Vibrant Sunset Orange - energetic, warm and distinctive'
  },
  'Dark Green': {
    name: 'Dark Green',
    hex: '#14532D',
    badgeBg: 'bg-emerald-900',
    textColor: 'text-white',
    description: 'Deep Forest Green - earthy, rich and modern classic'
  },
  Pink: {
    name: 'Pink',
    hex: '#EC4899',
    badgeBg: 'bg-pink-500',
    textColor: 'text-white',
    description: 'Soft Rose Pink - subtle, relaxed and contemporary'
  },
  Yellow: {
    name: 'Yellow',
    hex: '#EAB308',
    badgeBg: 'bg-amber-500',
    textColor: 'text-zinc-950',
    description: 'Rich Sunny Yellow - bright, uplifting and confident'
  }
};

export const SIZES: TShirtSize[] = ['M', 'L', 'XL', 'XXL'];

export interface SizeMeasurement {
  size: TShirtSize;
  chestInches: number;
  chestCm: number;
  lengthInches: number;
  lengthCm: number;
  shoulderInches: number;
  shoulderCm: number;
}

export const SIZE_CHART: SizeMeasurement[] = [
  { size: 'M', chestInches: 38, chestCm: 96.5, lengthInches: 27.5, lengthCm: 70, shoulderInches: 17.5, shoulderCm: 44.5 },
  { size: 'L', chestInches: 40, chestCm: 101.5, lengthInches: 28.5, lengthCm: 72.5, shoulderInches: 18.5, shoulderCm: 47 },
  { size: 'XL', chestInches: 42, chestCm: 106.5, lengthInches: 29.5, lengthCm: 75, shoulderInches: 19.5, shoulderCm: 49.5 },
  { size: 'XXL', chestInches: 44, chestCm: 112, lengthInches: 30.5, lengthCm: 77.5, shoulderInches: 20.5, shoulderCm: 52 }
];

export interface VariantStock {
  colour: TShirtColour;
  size: TShirtSize;
  stock: number;
  sku: string;
}

export interface CartItem {
  id: string; // colour-size
  colour: TShirtColour;
  size: TShirtSize;
  quantity: number;
  unitPrice: number; // 330
  memberPrice: number; // 300
}

export interface WishlistItem {
  id: string;
  colour: TShirtColour;
  size: TShirtSize;
  addedAt: string;
}

export interface CustomerAddress {
  fullName: string;
  mobile: string;
  houseNumber: string;
  streetRoad: string;
  areaColony: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Ready to Ship'
  | 'Shipped'
  | 'In Transit'
  | 'Delivered'
  | 'Cancelled'
  | 'Return Requested'
  | 'Returned'
  | 'Refunded';

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface ReturnRequestData {
  reason: string;
  requestDate: string;
  status: 'Requested' | 'Approved' | 'Picked Up' | 'Completed' | 'Rejected';
  exchangeSize?: TShirtSize;
  exchangeColour?: TShirtColour;
  type: 'Return' | 'Exchange';
}

export interface OrderRecord {
  orderId: string;
  date: string;
  customerName: string;
  mobile: string;
  address: CustomerAddress;
  items: CartItem[];
  subtotal: number;
  discount: number; // Member discount: ₹30 per item
  shipping: number; // 0 for online payment
  total: number;
  isMember: boolean;
  paymentMethod: 'Razorpay' | 'UPI' | 'Card' | 'NetBanking' | 'Wallet' | string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  transactionId: string;
  orderStatus: OrderStatus;
  trackingNumber: string;
  courierPartner: string;
  timeline: OrderTimelineEvent[];
  returnRequest?: ReturnRequestData;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  unitsSold: number;
  activeCustomers: number;
  lowStockVariants: VariantStock[];
}
