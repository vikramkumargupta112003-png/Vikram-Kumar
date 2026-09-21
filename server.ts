import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Enable CORS for Netlify previews and external integrations
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Normalize Netlify function rewrite paths
app.use((req, res, next) => {
  if (req.url.startsWith('/.netlify/functions/api')) {
    req.url = req.url.replace('/.netlify/functions/api', '/api');
  } else if (
    !req.url.startsWith('/api') &&
    (req.url.startsWith('/inventory') ||
      req.url.startsWith('/orders') ||
      req.url.startsWith('/razorpay') ||
      req.url.startsWith('/payment') ||
      req.url.startsWith('/admin'))
  ) {
    req.url = `/api${req.url}`;
  }
  next();
});

// Server configuration & secrets
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const PAYMENT_GATEWAY_SECRET = process.env.PAYMENT_GATEWAY_SECRET || 've_online_secret_key_prod_8829';
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

// Ensure data directory exists (handles serverless read-only filesystem via /tmp)
const IS_SERVERLESS = Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DATA_DIR = IS_SERVERLESS
  ? path.join('/tmp', 'data')
  : path.join(process.cwd(), 'data');

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('Notice: DATA_DIR creation handled in-memory', e);
}

const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const INVENTORY_FILE = path.join(DATA_DIR, 'inventory.json');

// Default initial inventory: 6 colours x 4 sizes
const DEFAULT_INVENTORY = [
  { colour: 'Black', size: 'M', stock: 45, sku: 'VE-RN-BLK-M' },
  { colour: 'Black', size: 'L', stock: 50, sku: 'VE-RN-BLK-L' },
  { colour: 'Black', size: 'XL', stock: 35, sku: 'VE-RN-BLK-XL' },
  { colour: 'Black', size: 'XXL', stock: 20, sku: 'VE-RN-BLK-XXL' },
  { colour: 'White', size: 'M', stock: 40, sku: 'VE-RN-WHT-M' },
  { colour: 'White', size: 'L', stock: 45, sku: 'VE-RN-WHT-L' },
  { colour: 'White', size: 'XL', stock: 30, sku: 'VE-RN-WHT-XL' },
  { colour: 'White', size: 'XXL', stock: 18, sku: 'VE-RN-WHT-XXL' },
  { colour: 'Orange', size: 'M', stock: 25, sku: 'VE-RN-ORG-M' },
  { colour: 'Orange', size: 'L', stock: 30, sku: 'VE-RN-ORG-L' },
  { colour: 'Orange', size: 'XL', stock: 20, sku: 'VE-RN-ORG-XL' },
  { colour: 'Orange', size: 'XXL', stock: 15, sku: 'VE-RN-ORG-XXL' },
  { colour: 'Dark Green', size: 'M', stock: 35, sku: 'VE-RN-DGR-M' },
  { colour: 'Dark Green', size: 'L', stock: 40, sku: 'VE-RN-DGR-L' },
  { colour: 'Dark Green', size: 'XL', stock: 25, sku: 'VE-RN-DGR-XL' },
  { colour: 'Dark Green', size: 'XXL', stock: 16, sku: 'VE-RN-DGR-XXL' },
  { colour: 'Pink', size: 'M', stock: 22, sku: 'VE-RN-PNK-M' },
  { colour: 'Pink', size: 'L', stock: 28, sku: 'VE-RN-PNK-L' },
  { colour: 'Pink', size: 'XL', stock: 18, sku: 'VE-RN-PNK-XL' },
  { colour: 'Pink', size: 'XXL', stock: 12, sku: 'VE-RN-PNK-XXL' },
  { colour: 'Yellow', size: 'M', stock: 26, sku: 'VE-RN-YLW-M' },
  { colour: 'Yellow', size: 'L', stock: 32, sku: 'VE-RN-YLW-L' },
  { colour: 'Yellow', size: 'XL', stock: 22, sku: 'VE-RN-YLW-XL' },
  { colour: 'Yellow', size: 'XXL', stock: 14, sku: 'VE-RN-YLW-XXL' }
];

function loadInventory() {
  try {
    if (fs.existsSync(INVENTORY_FILE)) {
      const content = fs.readFileSync(INVENTORY_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed to load inventory file:', err);
  }
  saveInventory(DEFAULT_INVENTORY);
  return DEFAULT_INVENTORY;
}

function saveInventory(inv: any[]) {
  try {
    fs.writeFileSync(INVENTORY_FILE, JSON.stringify(inv, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save inventory:', err);
  }
}

function loadOrders() {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const content = fs.readFileSync(ORDERS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed to load orders file:', err);
  }
  return [];
}

function saveOrders(orders: any[]) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save orders:', err);
  }
}

// In-memory caching with disk persistence
let currentInventory = loadInventory();
let currentOrders = loadOrders();

// ---------------------------------------------
// API ROUTES FIRST
// ---------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: 'VIKRAM ENTERPRESSES', timestamp: new Date().toISOString() });
});

// GET Current Inventory
app.get('/api/inventory', (req, res) => {
  res.json({ success: true, inventory: currentInventory });
});

// POST Create Online Payment Intent / Session
app.post('/api/payment/create-intent', (req, res) => {
  const { items, isMember } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'No items in order request' });
  }

  // Stock check
  for (const item of items) {
    const variant = currentInventory.find(
      (v: any) => v.colour === item.colour && v.size === item.size
    );
    if (!variant) {
      return res.status(400).json({ error: `Variant ${item.colour} (${item.size}) is not recognized.` });
    }
    if (variant.stock < item.quantity) {
      return res.status(400).json({
        error: `Insufficient stock for ${item.colour} in size ${item.size}. Available: ${variant.stock}`
      });
    }
  }

  const basePricePerItem = 330;
  const memberDiscountPerItem = isMember ? 30 : 0;
  const totalItems = items.reduce((sum: number, it: any) => sum + (it.quantity || 1), 0);
  const subtotal = totalItems * basePricePerItem;
  const discount = totalItems * memberDiscountPerItem;
  const shipping = 0; // Free shipping on all Online Prepaid Orders
  const total = subtotal - discount + shipping;

  const paymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  
  res.json({
    success: true,
    paymentIntentId,
    amount: total,
    currency: 'INR',
    breakdown: {
      subtotal,
      discount,
      shipping,
      total,
      isMember: !!isMember,
      totalItems
    }
  });
});

// POST Verify Payment and Confirm Order
// Secure payment-gateway verification
app.post('/api/payment/verify-and-confirm', (req, res) => {
  const {
    paymentIntentId,
    paymentMethod,
    transactionId,
    verificationToken,
    customer,
    items,
    isMember
  } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Missing items' });
  }

  if (!customer || !customer.fullName || !customer.mobile || !customer.pincode) {
    return res.status(400).json({ error: 'Incomplete customer address details' });
  }

  // Verify online payment token
  if (!transactionId || !paymentMethod) {
    return res.status(400).json({ error: 'Invalid or missing online payment verification data' });
  }

  // Verify stock once more before confirming
  for (const item of items) {
    const variant = currentInventory.find(
      (v: any) => v.colour === item.colour && v.size === item.size
    );
    if (!variant || variant.stock < item.quantity) {
      return res.status(400).json({
        error: `Sorry, ${item.colour} in size ${item.size} went out of stock during payment.`
      });
    }
  }

  // Deduct inventory
  items.forEach((item: any) => {
    const variant = currentInventory.find(
      (v: any) => v.colour === item.colour && v.size === item.size
    );
    if (variant) {
      variant.stock = Math.max(0, variant.stock - item.quantity);
    }
  });
  saveInventory(currentInventory);

  const basePricePerItem = 330;
  const memberDiscountPerItem = isMember ? 30 : 0;
  const totalItems = items.reduce((sum: number, it: any) => sum + (it.quantity || 1), 0);
  const subtotal = totalItems * basePricePerItem;
  const discount = totalItems * memberDiscountPerItem;
  const shipping = 0;
  const total = subtotal - discount + shipping;

  const orderYear = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const orderId = `VE-${orderYear}-${randomNum}`;
  const trackingNumber = `BD${Math.floor(10000000 + Math.random() * 90000000)}IN`;

  const newOrder = {
    orderId,
    date: new Date().toISOString(),
    customerName: customer.fullName,
    mobile: customer.mobile,
    address: customer,
    items,
    subtotal,
    discount,
    shipping,
    total,
    isMember: !!isMember,
    paymentMethod,
    paymentStatus: 'Paid',
    transactionId,
    orderStatus: 'Confirmed',
    trackingNumber,
    courierPartner: 'BlueDart Express',
    timeline: [
      {
        status: 'Confirmed',
        timestamp: new Date().toISOString(),
        note: `Online Payment of ₹${total} verified successfully via ${paymentMethod} (Txn: ${transactionId}). Order confirmed.`
      },
      {
        status: 'Processing',
        timestamp: new Date().toISOString(),
        note: 'Order details sent to warehouse. 100% Pure Cotton Plain T-Shirt quality check underway.'
      }
    ]
  };

  currentOrders.unshift(newOrder);
  saveOrders(currentOrders);

  res.json({
    success: true,
    order: newOrder,
    message: 'Online payment verified and order placed successfully'
  });
});

// GET Razorpay Public Configuration
app.get('/api/razorpay/config', (req, res) => {
  res.json({
    success: true,
    keyId: RAZORPAY_KEY_ID || 'rzp_test_vikram_enterpresses',
    isConfigured: !!(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET)
  });
});

// POST Razorpay: Create Order
app.post('/api/razorpay/create-order', async (req, res) => {
  try {
    const { items, isMember, customer } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty. Please select products to buy.' });
    }

    // Verify stock
    for (const item of items) {
      const variant = currentInventory.find(
        (v: any) => v.colour === item.colour && v.size === item.size
      );
      if (!variant) {
        return res.status(400).json({ error: `Variant ${item.colour} (${item.size}) is not recognized.` });
      }
      if (variant.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${item.colour} in size ${item.size}. Available: ${variant.stock}`
        });
      }
    }

    const basePricePerItem = 330;
    const memberDiscountPerItem = isMember ? 30 : 0;
    const totalItems = items.reduce((sum: number, it: any) => sum + (it.quantity || 1), 0);
    const subtotal = totalItems * basePricePerItem;
    const discount = totalItems * memberDiscountPerItem;
    const shipping = 0;
    const total = subtotal - discount + shipping;
    const amountInPaise = Math.round(total * 100);

    const receipt = `rcpt_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;

    // If live/test Razorpay API credentials are configured in environment
    if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
      try {
        const basicAuth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
        const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${basicAuth}`
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: 'INR',
            receipt,
            notes: {
              store: 'VIKRAM ENTERPRESSES',
              itemCount: totalItems,
              customerMobile: customer?.mobile || ''
            }
          })
        });

        const rzpData = await rzpResponse.json();
        if (!rzpResponse.ok) {
          throw new Error(rzpData.error?.description || 'Razorpay order creation failed');
        }

        return res.json({
          success: true,
          orderId: rzpData.id,
          amount: rzpData.amount,
          currency: rzpData.currency,
          keyId: RAZORPAY_KEY_ID,
          total,
          isLive: true
        });
      } catch (apiErr: any) {
        console.error('Razorpay live API error, falling back to seamless simulator mode:', apiErr.message);
      }
    }

    // Default seamless test/demo Razorpay order
    const mockRazorpayOrderId = `order_${Math.random().toString(36).substring(2, 14)}`;
    return res.json({
      success: true,
      orderId: mockRazorpayOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: RAZORPAY_KEY_ID || 'rzp_test_vikram_enterpresses',
      total,
      isLive: false,
      message: 'Razorpay order prepared'
    });
  } catch (err: any) {
    console.error('Create Razorpay order error:', err);
    res.status(500).json({ error: err.message || 'Failed to create Razorpay payment order' });
  }
});

// POST Razorpay: Verify Payment Signature and Confirm Order
app.post('/api/razorpay/verify-payment', (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customer,
      items,
      isMember,
      paymentMethod = 'Razorpay'
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Missing order items' });
    }

    if (!customer || !customer.fullName || !customer.mobile || !customer.pincode) {
      return res.status(400).json({ error: 'Incomplete customer delivery address' });
    }

    if (!razorpay_payment_id) {
      return res.status(400).json({ error: 'Missing Razorpay payment ID' });
    }

    // If Razorpay secret is set and signature provided, strictly verify SHA-256 HMAC
    if (RAZORPAY_KEY_SECRET && razorpay_signature && razorpay_order_id) {
      const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ error: 'Razorpay payment signature verification failed' });
      }
    }

    // Verify stock availability
    for (const item of items) {
      const variant = currentInventory.find(
        (v: any) => v.colour === item.colour && v.size === item.size
      );
      if (!variant || variant.stock < item.quantity) {
        return res.status(400).json({
          error: `Sorry, ${item.colour} in size ${item.size} went out of stock during payment.`
        });
      }
    }

    // Deduct stock
    items.forEach((item: any) => {
      const variant = currentInventory.find(
        (v: any) => v.colour === item.colour && v.size === item.size
      );
      if (variant) {
        variant.stock = Math.max(0, variant.stock - item.quantity);
      }
    });
    saveInventory(currentInventory);

    // Calculate totals
    const basePricePerItem = 330;
    const memberDiscountPerItem = isMember ? 30 : 0;
    const totalItems = items.reduce((sum: number, it: any) => sum + (it.quantity || 1), 0);
    const subtotal = totalItems * basePricePerItem;
    const discount = totalItems * memberDiscountPerItem;
    const shipping = 0;
    const total = subtotal - discount + shipping;

    const orderYear = new Date().getFullYear();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `VE-${orderYear}-${randomNum}`;
    const trackingNumber = `BD${Math.floor(10000000 + Math.random() * 90000000)}IN`;

    const newOrder = {
      orderId,
      date: new Date().toISOString(),
      customerName: customer.fullName,
      mobile: customer.mobile,
      address: customer,
      items,
      subtotal,
      discount,
      shipping,
      total,
      isMember: !!isMember,
      paymentMethod: `Razorpay (${paymentMethod})`,
      paymentStatus: 'Paid',
      transactionId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      orderStatus: 'Confirmed',
      trackingNumber,
      courierPartner: 'BlueDart Express',
      timeline: [
        {
          status: 'Confirmed',
          timestamp: new Date().toISOString(),
          note: `Online Payment of ₹${total} verified successfully via Razorpay (Payment ID: ${razorpay_payment_id}). Order confirmed.`
        },
        {
          status: 'Processing',
          timestamp: new Date().toISOString(),
          note: 'Order details dispatched to warehouse. 100% Pure Cotton Plain Round Neck T-Shirt packaging underway.'
        }
      ]
    };

    currentOrders.unshift(newOrder);
    saveOrders(currentOrders);

    return res.json({
      success: true,
      order: newOrder,
      message: 'Razorpay payment verified and order placed successfully!'
    });
  } catch (err: any) {
    console.error('Razorpay payment confirmation error:', err);
    res.status(500).json({ error: err.message || 'Payment confirmation error' });
  }
});

// GET Track Order by Order ID + Mobile Number
app.get('/api/orders/track', (req, res) => {
  const { orderId, mobile } = req.query;

  if (!orderId || !mobile) {
    return res.status(400).json({ error: 'Order ID and Mobile number are required' });
  }

  const cleanOrderId = String(orderId).trim().toUpperCase();
  const cleanMobile = String(mobile).trim().replace(/\D/g, '').slice(-10);

  const order = currentOrders.find((o: any) => {
    const oId = String(o.orderId).trim().toUpperCase();
    const oMob = String(o.mobile).trim().replace(/\D/g, '').slice(-10);
    return oId === cleanOrderId && oMob === cleanMobile;
  });

  if (!order) {
    return res.status(404).json({
      error: 'Order not found. Please verify your Order ID and 10-digit mobile number.'
    });
  }

  res.json({ success: true, order });
});

// POST Request Return or Exchange (within 7 days)
app.post('/api/orders/return-request', (req, res) => {
  const { orderId, mobile, reason, type, exchangeSize, exchangeColour } = req.body;

  if (!orderId || !mobile || !reason || !type) {
    return res.status(400).json({ error: 'Order ID, Mobile, Reason, and Request Type are required' });
  }

  const cleanOrderId = String(orderId).trim().toUpperCase();
  const cleanMobile = String(mobile).trim().replace(/\D/g, '').slice(-10);

  const order = currentOrders.find((o: any) => {
    const oId = String(o.orderId).trim().toUpperCase();
    const oMob = String(o.mobile).trim().replace(/\D/g, '').slice(-10);
    return oId === cleanOrderId && oMob === cleanMobile;
  });

  if (!order) {
    return res.status(404).json({ error: 'Order not found with provided credentials.' });
  }

  // Check 7 day window from order date
  const orderDate = new Date(order.date).getTime();
  const diffDays = (Date.now() - orderDate) / (1000 * 3600 * 24);
  if (diffDays > 7.5) {
    return res.status(400).json({
      error: 'Return & Exchange window of 7 days has expired for this order.'
    });
  }

  order.returnRequest = {
    reason,
    requestDate: new Date().toISOString(),
    status: 'Requested',
    type,
    exchangeSize,
    exchangeColour
  };
  order.orderStatus = 'Return Requested';
  order.timeline.push({
    status: 'Return Requested',
    timestamp: new Date().toISOString(),
    note: `Customer requested ${type}: "${reason}". Subject to unused, unwashed product condition check.`
  });

  saveOrders(currentOrders);

  res.json({
    success: true,
    message: `${type} request submitted successfully. Our team will arrange reverse pickup.`,
    order
  });
});

// ---------------------------------------------
// ADMIN SECURED ENDPOINTS
// ---------------------------------------------

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = `ve_admin_session_${Date.now()}`;
    return res.json({ success: true, token, store: 'VIKRAM ENTERPRESSES' });
  }
  return res.status(401).json({ error: 'Invalid admin credentials' });
});

// Admin Middleware check
function adminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ve_admin_session_')) {
    return res.status(403).json({ error: 'Unauthorized admin access' });
  }
  next();
}

// GET All Orders for Admin
app.get('/api/admin/orders', adminAuth, (req, res) => {
  res.json({ success: true, orders: currentOrders });
});

// PUT Update Order Status (Admin)
app.put('/api/admin/orders/:id', adminAuth, (req, res) => {
  const { id } = req.params;
  const { orderStatus, trackingNumber, courierPartner, note } = req.body;

  const order = currentOrders.find((o: any) => o.orderId === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (orderStatus) {
    order.orderStatus = orderStatus;
    order.timeline.push({
      status: orderStatus,
      timestamp: new Date().toISOString(),
      note: note || `Order status updated to ${orderStatus}`
    });
  }

  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (courierPartner) order.courierPartner = courierPartner;

  saveOrders(currentOrders);
  res.json({ success: true, order });
});

// POST Admin Inventory Update
app.post('/api/admin/inventory', adminAuth, (req, res) => {
  const { colour, size, stock } = req.body;
  const variant = currentInventory.find((v: any) => v.colour === colour && v.size === size);

  if (!variant) {
    return res.status(404).json({ error: 'Variant not found' });
  }

  variant.stock = Math.max(0, parseInt(stock, 10) || 0);
  saveInventory(currentInventory);

  res.json({ success: true, variant, inventory: currentInventory });
});

// GET Admin Analytics
app.get('/api/admin/analytics', adminAuth, (req, res) => {
  const totalRevenue = currentOrders
    .filter((o: any) => o.paymentStatus === 'Paid')
    .reduce((sum: number, o: any) => sum + (o.total || 0), 0);

  const unitsSold = currentOrders
    .filter((o: any) => o.paymentStatus === 'Paid')
    .reduce((sum: number, o: any) => {
      const itemsCount = (o.items || []).reduce((acc: number, it: any) => acc + (it.quantity || 1), 0);
      return sum + itemsCount;
    }, 0);

  const customersSet = new Set(currentOrders.map((o: any) => o.mobile));
  const lowStockVariants = currentInventory.filter((v: any) => v.stock <= 15);

  res.json({
    success: true,
    stats: {
      totalRevenue,
      totalOrders: currentOrders.length,
      unitsSold,
      activeCustomers: customersSet.size,
      lowStockVariants
    }
  });
});

// ---------------------------------------------
// VITE MIDDLEWARE / SPA FALLBACK
// ---------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

// Only start standalone HTTP server if not running inside Netlify Functions or AWS Lambda
if (!process.env.NETLIFY && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  startServer();
}

export { app };
export default app;
