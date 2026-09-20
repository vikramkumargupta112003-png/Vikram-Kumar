import React from 'react';
import { OrderRecord, COLOUR_CONFIGS } from '../types';
import { STORE_CONFIG, getWhatsAppOrderUrl } from '../data/store';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Printer, 
  MessageCircle, 
  ArrowRight, 
  ShieldCheck,
  Copy,
  Check
} from 'lucide-react';

interface OrderSuccessViewProps {
  order: OrderRecord;
  onNavigate: (view: string) => void;
  onTrackOrder: (orderId: string, mobile: string) => void;
}

export const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({
  order,
  onNavigate,
  onTrackOrder
}) => {
  const [copied, setCopied] = React.useState(false);

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappUrl = getWhatsAppOrderUrl({
    orderId: order.orderId
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="order-success-view" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Celebration Card */}
      <div className="text-center space-y-3 p-8 bg-emerald-50/60 rounded-3xl border border-emerald-200 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
          Payment Verified & Confirmed
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
          Thank You, {order.customerName}!
        </h1>
        <p className="text-sm text-zinc-600 max-w-lg mx-auto">
          Your online payment has been successfully authorized. Your order is confirmed and sent to our fulfillment hub for quality check and dispatch.
        </p>
      </div>

      {/* Order Reference Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
        {/* Top order metadata */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
          <div>
            <div className="text-xs text-zinc-500 font-medium">Order Identification Number:</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl sm:text-2xl font-mono font-black text-zinc-950">
                {order.orderId}
              </span>
              <button
                type="button"
                onClick={copyOrderId}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                title="Copy Order ID"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-xs text-zinc-400 mt-1">
              Date: {new Date(order.date).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
              Status: {order.orderStatus}
            </span>
            <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-bold">
              Payment: {order.paymentStatus} ({order.paymentMethod})
            </span>
          </div>
        </div>

        {/* Courier & Tracking preview */}
        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-zinc-900 text-white">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900">
                Courier Partner: {order.courierPartner}
              </div>
              <div className="text-xs text-zinc-500 font-mono">
                Tracking AWB: <strong>{order.trackingNumber}</strong>
              </div>
            </div>
          </div>

          <button
            id="success-track-btn"
            type="button"
            onClick={() => onTrackOrder(order.orderId, order.mobile)}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            Track Live Status
          </button>
        </div>

        {/* Items list */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Purchased Plain T-Shirts
          </h3>

          <div className="divide-y divide-zinc-100 border rounded-2xl border-zinc-200 overflow-hidden">
            {order.items.map((it, idx) => {
              const cfg = COLOUR_CONFIGS[it.colour];
              return (
                <div key={idx} className="p-4 flex items-center justify-between gap-4 bg-white">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-lg border border-black/10 shrink-0 flex items-center justify-center text-[10px] font-black text-white"
                      style={{ backgroundColor: cfg.hex }}
                    >
                      {it.size}
                    </span>
                    <div>
                      <div className="text-xs font-extrabold text-zinc-950">
                        {STORE_CONFIG.productName}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        Colour: <strong>{it.colour}</strong> • Size: <strong>{it.size}</strong> • Qty: {it.quantity}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-zinc-900">
                      ₹{order.isMember ? STORE_CONFIG.memberPrice * it.quantity : STORE_CONFIG.basePrice * it.quantity}
                    </div>
                    {order.isMember && (
                      <div className="text-[10px] text-emerald-700 font-semibold">
                        Member Saved ₹{STORE_CONFIG.memberDiscount * it.quantity}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/90 space-y-2 text-xs text-zinc-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold text-zinc-900">₹{order.subtotal}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Member Discount</span>
              <span>-₹{order.discount}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping & Handling</span>
            <span className="font-bold text-emerald-700">FREE</span>
          </div>
          <div className="pt-2 border-t border-zinc-200 flex justify-between text-sm font-black text-zinc-950">
            <span>Total Paid (Online)</span>
            <span>₹{order.total}</span>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="p-4 bg-white rounded-2xl border border-zinc-200 text-xs text-zinc-700 space-y-1">
          <div className="font-bold text-zinc-900">Delivery Address:</div>
          <div>{order.address.fullName} ({order.mobile})</div>
          <div>{order.address.houseNumber}, {order.address.streetRoad}</div>
          <div>{order.address.areaColony} {order.address.landmark ? `(Near ${order.address.landmark})` : ''}</div>
          <div>{order.address.city}, {order.address.state} - {order.address.pincode}</div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-zinc-100">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl border border-zinc-300 hover:bg-zinc-50 text-xs font-bold text-zinc-800 flex items-center justify-center gap-1.5 transition-colors w-full sm:w-auto"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors w-full sm:w-auto"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Order WhatsApp Support</span>
            </a>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('shop')}
            className="px-6 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors w-full sm:w-auto"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
