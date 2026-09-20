import {
  TShirtColour,
  TShirtSize,
  VariantStock,
  OrderRecord,
  SIZES
} from '../types';

export const INITIAL_VARIANTS: VariantStock[] = [
  // Black
  { colour: 'Black', size: 'M', stock: 45, sku: 'VE-RN-BLK-M' },
  { colour: 'Black', size: 'L', stock: 50, sku: 'VE-RN-BLK-L' },
  { colour: 'Black', size: 'XL', stock: 35, sku: 'VE-RN-BLK-XL' },
  { colour: 'Black', size: 'XXL', stock: 20, sku: 'VE-RN-BLK-XXL' },
  // White
  { colour: 'White', size: 'M', stock: 40, sku: 'VE-RN-WHT-M' },
  { colour: 'White', size: 'L', stock: 45, sku: 'VE-RN-WHT-L' },
  { colour: 'White', size: 'XL', stock: 30, sku: 'VE-RN-WHT-XL' },
  { colour: 'White', size: 'XXL', stock: 18, sku: 'VE-RN-WHT-XXL' },
  // Orange
  { colour: 'Orange', size: 'M', stock: 25, sku: 'VE-RN-ORG-M' },
  { colour: 'Orange', size: 'L', stock: 30, sku: 'VE-RN-ORG-L' },
  { colour: 'Orange', size: 'XL', stock: 20, sku: 'VE-RN-ORG-XL' },
  { colour: 'Orange', size: 'XXL', stock: 15, sku: 'VE-RN-ORG-XXL' },
  // Dark Green
  { colour: 'Dark Green', size: 'M', stock: 35, sku: 'VE-RN-DGR-M' },
  { colour: 'Dark Green', size: 'L', stock: 40, sku: 'VE-RN-DGR-L' },
  { colour: 'Dark Green', size: 'XL', stock: 25, sku: 'VE-RN-DGR-XL' },
  { colour: 'Dark Green', size: 'XXL', stock: 16, sku: 'VE-RN-DGR-XXL' },
  // Pink
  { colour: 'Pink', size: 'M', stock: 22, sku: 'VE-RN-PNK-M' },
  { colour: 'Pink', size: 'L', stock: 28, sku: 'VE-RN-PNK-L' },
  { colour: 'Pink', size: 'XL', stock: 18, sku: 'VE-RN-PNK-XL' },
  { colour: 'Pink', size: 'XXL', stock: 12, sku: 'VE-RN-PNK-XXL' },
  // Yellow
  { colour: 'Yellow', size: 'M', stock: 26, sku: 'VE-RN-YLW-M' },
  { colour: 'Yellow', size: 'L', stock: 32, sku: 'VE-RN-YLW-L' },
  { colour: 'Yellow', size: 'XL', stock: 22, sku: 'VE-RN-YLW-XL' },
  { colour: 'Yellow', size: 'XXL', stock: 14, sku: 'VE-RN-YLW-XXL' }
];

export const STORE_CONFIG = {
  brandName: 'VIKRAM ENTERPRESSES',
  tagline: 'Simple Style. Everyday Comfort.',
  subheading: 'Premium Plain Round Neck T-Shirts made for comfortable everyday wear.',
  productName: 'Plain Round Neck T-Shirt',
  basePrice: 330,
  memberDiscount: 30,
  memberPrice: 300,
  fabric: '100% Pure Combed Cotton (180 GSM Bio-Washed Single Jersey)',
  whatsappNumber: '919876543210',
  supportEmail: 'care@vikramenterrpresses.com',
  businessAddress: 'VIKRAM ENTERPRESSES, Sector 18, Industrial Area, Gurugram, Haryana - 122008, India',
  dispatchTime: 'Dispatched within 24 to 48 business hours',
  deliveryTime: '3 to 5 business days across India via premium tracked couriers',
  returnWindowDays: 7
};

export function getVariantSku(colour: TShirtColour, size: TShirtSize): string {
  const c = colour.substring(0, 3).toUpperCase();
  return `VE-RN-${c}-${size}`;
}

export function generateOrderId(): string {
  const year = new Date().getFullYear();
  const randomPart = Math.floor(10000 + Math.random() * 90000);
  return `VE-${year}-${randomPart}`;
}

export function generateTrackingNumber(): string {
  const prefix = 'BD';
  const num = Math.floor(10000000 + Math.random() * 90000000);
  return `${prefix}${num}IN`;
}

// Pre-fill WhatsApp message link generator
export function getWhatsAppOrderUrl(params: {
  productName?: string;
  colour?: string;
  size?: string;
  quantity?: number;
  orderId?: string;
  customMessage?: string;
}): string {
  let message = `Hello VIKRAM ENTERPRESSES Team!%0A`;

  if (params.orderId) {
    message += `I have a query regarding my Order ID: *${params.orderId}*.%0A`;
  } else if (params.productName) {
    message += `I would like to enquire/order:%0A`;
    message += `• Product: *${params.productName}*%0A`;
    if (params.colour) message += `• Colour: *${params.colour}*%0A`;
    if (params.size) message += `• Size: *${params.size}*%0A`;
    if (params.quantity) message += `• Quantity: *${params.quantity}*%0A`;
    message += `• Online Price: ₹330 (Member: ₹300)%0A`;
  } else if (params.customMessage) {
    message += `${encodeURIComponent(params.customMessage)}%0A`;
  } else {
    message += `I would like to know more about your Plain Round Neck T-Shirts.%0A`;
  }

  message += `%0APlease assist me. Thank you!`;
  return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${message}`;
}
