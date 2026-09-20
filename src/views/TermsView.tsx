import React from 'react';
import { STORE_CONFIG } from '../data/store';
import { FileText } from 'lucide-react';

export const TermsView: React.FC = () => {
  return (
    <div id="terms-view" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="border-b border-zinc-200 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 text-xs font-bold uppercase tracking-wider mb-2">
          <FileText className="w-3.5 h-3.5" />
          Legal Agreement
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Last Updated: January 2026 • VIKRAM ENTERPRESSES
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200 shadow-sm space-y-6 text-sm text-zinc-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-zinc-950">
            1. Scope of Products
          </h2>
          <p>
            <strong>{STORE_CONFIG.brandName}</strong> is an independent clothing label dedicated exclusively to selling <strong>Plain Round Neck T-Shirts</strong> crafted from 100% pure cotton. We do not sell shirts, jeans, trousers, hoodies, jackets, or any printed/graphic clothing.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-zinc-950">
            2. Online Payments Only
          </h2>
          <p>
            All purchases made on this website are strictly subject to authorized online electronic payment (UPI, Debit/Credit Card, NetBanking, and Digital Wallets). An order is deemed accepted only after digital confirmation and cryptographic validation from our payment gateway partner.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-zinc-950">
            3. Pricing & Member Discounts
          </h2>
          <p>
            The standard online checkout price is <strong>₹330</strong> per unit. VIP Members receive an immediate <strong>₹30 discount</strong>, reducing the price to <strong>₹300</strong> per unit. Prices are inclusive of all applicable indirect goods and services taxes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-zinc-950">
            4. Accuracy of Customer Details
          </h2>
          <p>
            By placing an order, the customer warrants that all provided address particulars (full name, 10-digit mobile number, house number, street name, area, city, and 6-digit PIN code) are authentic and correct.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-zinc-950">
            5. Intellectual Property
          </h2>
          <p>
            All brand trademarks, trade names, visualizer renders, product descriptions, and textual content are the exclusive proprietary property of {STORE_CONFIG.brandName}.
          </p>
        </section>
      </div>
    </div>
  );
};
