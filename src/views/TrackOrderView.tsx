import React, { useState, useEffect } from 'react';
import { OrderRecord, OrderStatus, COLOUR_CONFIGS } from '../types';
import { STORE_CONFIG, getWhatsAppOrderUrl } from '../data/store';
import { 
  Search, 
  Truck, 
  Package, 
  CheckCircle2, 
  RotateCcw, 
  Clock, 
  AlertCircle, 
  MessageCircle, 
  ShieldCheck,
  ChevronRight,
  Loader2
} from 'lucide-react';

interface TrackOrderViewProps {
  initialOrderId?: string;
  initialMobile?: string;
}

const ORDER_STEPS: OrderStatus[] = [
  'Confirmed',
  'Processing',
  'Ready to Ship',
  'Shipped',
  'In Transit',
  'Delivered'
];

export const TrackOrderView: React.FC<TrackOrderViewProps> = ({
  initialOrderId = '',
  initialMobile = ''
}) => {
  const [orderId, setOrderId] = useState(initialOrderId);
  const [mobile, setMobile] = useState(initialMobile);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Return/Exchange form states
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnType, setReturnType] = useState<'Return' | 'Exchange'>('Exchange');
  const [returnReason, setReturnReason] = useState('');
  const [exchangeSize, setExchangeSize] = useState('L');
  const [exchangeColour, setExchangeColour] = useState('Black');
  const [returnSubmitting, setReturnSubmitting] = useState(false);
  const [returnSuccessNotice, setReturnSuccessNotice] = useState<string | null>(null);

  const fetchOrder = async (searchId: string, searchMobile: string) => {
    if (!searchId.trim() || !searchMobile.trim()) {
      setErrorMessage('Please provide both Order ID and Mobile number.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(
        `/api/orders/track?orderId=${encodeURIComponent(searchId.trim())}&mobile=${encodeURIComponent(searchMobile.trim())}`
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Order could not be found. Please check details.');
      }
      setOrder(data.order);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to track order');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId && initialMobile) {
      fetchOrder(initialOrderId, initialMobile);
    }
  }, [initialOrderId, initialMobile]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderId, mobile);
  };

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    if (!returnReason.trim()) {
      alert('Please provide a reason for return/exchange.');
      return;
    }

    setReturnSubmitting(true);
    try {
      const res = await fetch('/api/orders/return-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.orderId,
          mobile: order.mobile,
          reason: returnReason,
          type: returnType,
          exchangeSize: returnType === 'Exchange' ? exchangeSize : undefined,
          exchangeColour: returnType === 'Exchange' ? exchangeColour : undefined
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to request return');
      }

      setReturnSuccessNotice(data.message);
      setOrder(data.order);
      setShowReturnModal(false);
    } catch (err: any) {
      alert(err.message || 'Error submitting request');
    } finally {
      setReturnSubmitting(false);
    }
  };

  const currentStepIndex = order ? ORDER_STEPS.indexOf(order.orderStatus) : -1;

  const whatsappUrl = order
    ? getWhatsAppOrderUrl({ orderId: order.orderId })
    : getWhatsAppOrderUrl({ customMessage: 'Hi VIKRAM ENTERPRESSES, I would like to track my order.' });

  return (
    <div id="track-order-view" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 text-xs font-bold uppercase tracking-wider">
          <Truck className="w-3.5 h-3.5" />
          Live Courier Tracking
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
          Track Your Order
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
          Enter your Order ID (e.g., VE-2026-XXXXX) and the 10-digit mobile number used during online checkout.
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/90 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Order ID *
            </label>
            <input
              id="track-order-id-input"
              type="text"
              placeholder="e.g. VE-2026-12345"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs font-mono font-bold bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950 text-zinc-900"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              10-Digit Mobile Number *
            </label>
            <input
              id="track-mobile-input"
              type="tel"
              maxLength={10}
              placeholder="e.g. 9876543210"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs font-bold bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950 text-zinc-900"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              id="track-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track</span>
                </>
              )}
            </button>
          </div>
        </form>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {returnSuccessNotice && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{returnSuccessNotice}</span>
          </div>
        )}
      </div>

      {/* Order Result Card */}
      {order && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-8 animate-in fade-in">
          {/* Order Header Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
            <div>
              <div className="text-xs text-zinc-500">Tracking Order:</div>
              <div className="text-xl font-mono font-black text-zinc-950 mt-0.5">
                {order.orderId}
              </div>
              <div className="text-xs text-zinc-400">
                Customer: <strong>{order.customerName}</strong> ({order.mobile})
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                order.orderStatus === 'Delivered' 
                  ? 'bg-emerald-100 text-emerald-900' 
                  : order.orderStatus === 'Cancelled'
                  ? 'bg-red-100 text-red-900'
                  : 'bg-amber-100 text-amber-900'
              }`}>
                Status: {order.orderStatus}
              </span>
              <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-bold">
                Online Paid: ₹{order.total}
              </span>
            </div>
          </div>

          {/* Step Timeline Progress Bar */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Delivery Progress
            </h3>

            <div className="relative py-4">
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                {ORDER_STEPS.map((step, idx) => {
                  const isCompleted = currentStepIndex >= idx;
                  const isCurrent = currentStepIndex === idx;

                  return (
                    <div key={step} className="flex flex-col items-center text-center space-y-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          isCurrent
                            ? 'bg-zinc-950 text-white ring-4 ring-zinc-200'
                            : isCompleted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-zinc-100 text-zinc-400'
                        }`}
                      >
                        {isCompleted && !isCurrent ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>
                      <span className={`text-[11px] font-bold ${
                        isCurrent
                          ? 'text-zinc-950'
                          : isCompleted
                          ? 'text-emerald-700'
                          : 'text-zinc-400'
                      }`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Courier Partner & Waybill details */}
          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/90 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-zinc-400 block font-medium">Logistics Partner</span>
              <strong className="text-zinc-900 text-sm">{order.courierPartner || 'BlueDart Express'}</strong>
            </div>
            <div>
              <span className="text-zinc-400 block font-medium">Air Waybill / Tracking No.</span>
              <strong className="text-zinc-900 font-mono text-sm">{order.trackingNumber}</strong>
            </div>
            <div>
              <span className="text-zinc-400 block font-medium">Estimated Delivery</span>
              <strong className="text-zinc-900 text-sm">3 to 5 business days</strong>
            </div>
          </div>

          {/* Detailed Activity Logs */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Live Status Timeline Logs
            </h3>
            <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-2xl overflow-hidden">
              {order.timeline.map((event, i) => (
                <div key={i} className="p-4 bg-white flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-zinc-100 text-zinc-700 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-zinc-950">{event.status}</strong>
                      <span className="text-zinc-400 text-[11px]">
                        {new Date(event.timestamp).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-zinc-600 mt-0.5">{event.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items in order */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Items in This Shipment
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {order.items.map((it, idx) => {
                const cfg = COLOUR_CONFIGS[it.colour];
                return (
                  <div key={idx} className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg border border-black/10 shrink-0 flex items-center justify-center text-[10px] font-black text-white"
                      style={{ backgroundColor: cfg.hex }}
                    >
                      {it.size}
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-zinc-900">{STORE_CONFIG.productName}</div>
                      <div className="text-zinc-500 text-[11px]">
                        Colour: <strong>{it.colour}</strong> • Size: <strong>{it.size}</strong> • Qty: {it.quantity}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 7-Day Return & Exchange Request Section */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
                <RotateCcw className="w-4 h-4 text-amber-700" />
                <span>7-Day Return & Exchange Policy</span>
              </div>
              <p className="text-xs text-zinc-600 max-w-lg">
                Need a different size or colour? Or looking to return? Products must be unused, unwashed, and in original packaging.
              </p>
            </div>

            <button
              id="request-return-btn"
              type="button"
              onClick={() => setShowReturnModal(true)}
              className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs whitespace-nowrap"
            >
              Request Return / Exchange
            </button>
          </div>

          {/* Support Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Query via WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* Return & Exchange Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                <span>Return / Exchange Request</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowReturnModal(false)}
                className="text-zinc-400 hover:text-zinc-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReturnSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Request Type:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setReturnType('Exchange')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold ${
                      returnType === 'Exchange'
                        ? 'bg-zinc-950 text-white border-zinc-950'
                        : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                    }`}
                  >
                    Size/Colour Exchange
                  </button>
                  <button
                    type="button"
                    onClick={() => setReturnType('Return')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold ${
                      returnType === 'Return'
                        ? 'bg-zinc-950 text-white border-zinc-950'
                        : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                    }`}
                  >
                    Return & Refund
                  </button>
                </div>
              </div>

              {returnType === 'Exchange' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      Exchange Size:
                    </label>
                    <select
                      value={exchangeSize}
                      onChange={(e) => setExchangeSize(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 bg-zinc-50"
                    >
                      {['M', 'L', 'XL', 'XXL'].map((sz) => (
                        <option key={sz} value={sz}>{sz}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      Exchange Colour:
                    </label>
                    <select
                      value={exchangeColour}
                      onChange={(e) => setExchangeColour(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 bg-zinc-50"
                    >
                      {['Black', 'White', 'Orange', 'Dark Green', 'Pink', 'Yellow'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Reason for Request *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Need larger size for relaxed fit / colour preference"
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900"
                />
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl text-[11px] text-zinc-600">
                <strong>Condition Checklist:</strong> Product must be completely unused, unwashed, with all original tags attached.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReturnModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={returnSubmitting}
                  className="px-5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  {returnSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
