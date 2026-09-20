import React from 'react';
import { STORE_CONFIG } from '../data/store';
import { Truck, ShieldCheck, Clock, MapPin } from 'lucide-react';

export const ShippingPolicyView: React.FC = () => {
  return (
    <div id="shipping-policy-view" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="border-b border-zinc-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 text-xs font-bold uppercase tracking-wider mb-2">
          <Truck className="w-3.5 h-3.5" />
          Fulfillment Guidelines
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
          Shipping & Delivery Policy
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Effective Date: January 1, 2026 • VIKRAM ENTERPRESSES
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200 shadow-sm space-y-6 text-sm text-zinc-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-zinc-950">
            1. Order Dispatch Timelines
          </h2>
          <p>
            All confirmed online prepaid orders for our Plain Round Neck T-Shirts are packaged and dispatched from our primary facility within <strong>24 to 48 business hours</strong> (excluding national holidays and Sundays).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-zinc-950">
            2. Estimated Delivery Timeframes
          </h2>
          <p>
            We partner with premier courier networks (BlueDart, Delhivery, Xpressbees) to ensure dependable transit across India:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li><strong>Metro Cities (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata):</strong> 2 to 4 business days.</li>
            <li><strong>Rest of India (Tier 2 & Tier 3 cities):</strong> 3 to 5 business days.</li>
            <li><strong>Remote & Special Zones:</strong> 5 to 7 business days.</li>
          </ul>
          <p className="text-xs text-zinc-500 italic">
            *Please note that we do not promise fixed-hour delivery times as actual delivery relies on regional road logistics and courier network traffic.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-zinc-950">
            3. Shipping Charges
          </h2>
          <p>
            We provide <strong>FREE standard tracked shipping</strong> on all online prepaid orders. There are no surprise handling fees, processing surcharges, or hidden checkout costs.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-zinc-950">
            4. Live Order Tracking
          </h2>
          <p>
            As soon as your shipment is picked up by our courier partner, a unique Tracking Air Waybill (AWB) number is generated. You can monitor the live step-by-step transit status anytime on our <strong>Track Order</strong> page by entering your Order ID and 10-digit mobile number.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-zinc-950">
            5. Delivery Address Accuracy
          </h2>
          <p>
            Customers are requested to provide accurate house numbers, complete road/street names, landmarks, and valid 6-digit PIN codes to prevent transit delays. In the event of an undelivered parcel due to an incorrect address, our support team will contact you for address re-verification.
          </p>
        </section>
      </div>
    </div>
  );
};
