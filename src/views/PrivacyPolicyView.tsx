import React from 'react';
import { STORE_CONFIG } from '../data/store';
import { ShieldCheck, Lock } from 'lucide-react';

export const PrivacyPolicyView: React.FC = () => {
  return (
    <div id="privacy-policy-view" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="border-b border-zinc-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 text-xs font-bold uppercase tracking-wider mb-2">
          <Lock className="w-3.5 h-3.5" />
          Data Security
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Last Updated: January 2026 • VIKRAM ENTERPRESSES
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200 shadow-sm space-y-6 text-sm text-zinc-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-zinc-950">
            1. Information We Collect
          </h2>
          <p>
            When you purchase our Plain Round Neck T-Shirts, we collect strictly the information necessary to fulfill your order and facilitate delivery:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li><strong>Contact Particulars:</strong> Customer Full Name and 10-digit Mobile Number.</li>
            <li><strong>Delivery Address:</strong> House number, street/road, colony/area, landmark, city, state, and postal PIN code.</li>
            <li><strong>Transaction Record:</strong> Payment transaction token and confirmation ID (we do not store your private card CVV or netbanking passwords; all payments are processed through encrypted gateways).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-zinc-950">
            2. How Your Information is Used
          </h2>
          <p>
            Your information is used strictly to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Generate unique Order IDs and verify authorized online payment.</li>
            <li>Dispatch items via courier partners and send live SMS/WhatsApp transit updates.</li>
            <li>Process size exchanges or returns initiated within our 7-day window.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-zinc-950">
            3. Zero Sale of Data
          </h2>
          <p>
            <strong>{STORE_CONFIG.brandName}</strong> adheres to a zero-compromise privacy commitment. We never sell, lease, rent, or trade your personal or contact information to any third-party marketing companies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-zinc-950">
            4. Data Retention & Queries
          </h2>
          <p>
            Order records are retained in compliance with applicable commercial accounting laws. For any queries regarding your personal data, contact us at <strong>{STORE_CONFIG.supportEmail}</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};
