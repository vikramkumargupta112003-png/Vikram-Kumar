import React, { useState } from 'react';
import { STORE_CONFIG, getWhatsAppOrderUrl } from '../data/store';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2, Clock } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  const whatsappUrl = getWhatsAppOrderUrl({
    customMessage: 'Hi VIKRAM ENTERPRESSES, I would like to get in touch with your team.'
  });

  return (
    <div id="contact-view" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 text-xs font-bold uppercase tracking-wider">
          Direct Support
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight">
          Contact Customer Care
        </h1>
        <p className="text-base text-zinc-600 max-w-lg mx-auto">
          We are here to assist with product enquiries, size selections, and order status updates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact Info Cards */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-5 bg-white rounded-2xl border border-zinc-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
              <Mail className="w-4 h-4 text-zinc-900" />
              <span>Email Support</span>
            </div>
            <a href={`mailto:${STORE_CONFIG.supportEmail}`} className="text-sm font-bold text-zinc-900 hover:underline block">
              {STORE_CONFIG.supportEmail}
            </a>
            <p className="text-[11px] text-zinc-500">Responses within 24 business hours</p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-zinc-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
              <Phone className="w-4 h-4 text-zinc-900" />
              <span>WhatsApp / Phone</span>
            </div>
            <div className="text-sm font-bold text-zinc-900">+91 98765 43210</div>
            <p className="text-[11px] text-zinc-500">Available Mon – Sat, 10:00 AM – 6:30 PM IST</p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-zinc-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-zinc-900" />
              <span>Operating Facility</span>
            </div>
            <p className="text-xs text-zinc-700 leading-relaxed font-medium">
              {STORE_CONFIG.businessAddress}
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat Directly on WhatsApp</span>
          </a>
        </div>

        {/* Form */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xs space-y-5">
          <h2 className="text-lg font-extrabold text-zinc-950">
            Send an Inquiry
          </h2>

          {submitted ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-zinc-900">Message Received!</h3>
              <p className="text-xs text-zinc-600">
                Thank you, <strong>{name}</strong>. Our team will review your inquiry and respond to your mobile (+91 {mobile}) shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setMobile('');
                  setMessage('');
                }}
                className="text-xs font-bold text-zinc-900 underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  10-Digit Mobile Number *
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  placeholder="9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Your Message or Question *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us how we can help you..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
