import React from 'react';
import { STORE_CONFIG } from '../data/store';
import { RotateCcw, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';

interface ReturnPolicyViewProps {
  onNavigate: (view: string) => void;
}

export const ReturnPolicyView: React.FC<ReturnPolicyViewProps> = ({ onNavigate }) => {
  return (
    <div id="return-policy-view" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="border-b border-zinc-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 text-xs font-bold uppercase tracking-wider mb-2">
          <RotateCcw className="w-3.5 h-3.5" />
          Customer Confidence
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
          Return & Exchange Policy (7 Days)
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Simple, Fair and Transparent • VIKRAM ENTERPRESSES
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200 shadow-sm space-y-6 text-sm text-zinc-700 leading-relaxed">
        {/* Highlight Guarantee */}
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-extrabold text-zinc-950 text-xs sm:text-sm">
              7-Day Worry-Free Exchange & Return Window
            </h3>
            <p className="text-xs text-zinc-600">
              Customers can request a size exchange, colour replacement, or product return within <strong>7 days of delivery</strong>, subject to our product condition criteria below.
            </p>
          </div>
        </div>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-zinc-950">
            1. Eligible Product Conditions
          </h2>
          <p>
            To qualify for an exchange or refund, the returned Plain Round Neck T-Shirt must strictly meet the following standards:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li><strong>Unused & Unworn:</strong> The garment must show zero signs of wear, body odor, perfume, or cosmetic stains.</li>
            <li><strong>Unwashed:</strong> The pure combed cotton fabric must remain in its original factory bio-washed condition without being laundered.</li>
            <li><strong>Original Packaging & Tags:</strong> All original tags, labels, and protective polybags must be intact.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-zinc-950">
            2. Size & Colour Exchanges
          </h2>
          <p>
            If your Plain T-Shirt is tighter or looser than preferred, you can request an exchange for another size (M, L, XL, XXL) or any of our other available colours (Black, White, Orange, Dark Green, Pink, Yellow). Reverse pickup is arranged from your doorstep.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-zinc-950">
            3. Refund Process for Online Prepaid Orders
          </h2>
          <p>
            Once our warehouse quality team receives the returned article and verifies that it is unused and in original packaging, your refund is credited directly back to the original source account (UPI / Bank Account / Debit Card / NetBanking) within <strong>3 to 5 business days</strong>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-zinc-950">
            4. How to Initiate a Return or Exchange
          </h2>
          <p>
            You do not need to wait on long phone calls. Simply visit our <strong>Track Order</strong> page, enter your Order ID and 10-digit mobile number, and click <strong>"Request Return / Exchange"</strong> to submit your request in seconds.
          </p>
          <div>
            <button
              type="button"
              onClick={() => onNavigate('track-order')}
              className="px-6 py-3 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-2"
            >
              <span>Go to Track Order & Initiate Request</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
