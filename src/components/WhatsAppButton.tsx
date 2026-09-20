import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppOrderUrl } from '../data/store';

interface WhatsAppButtonProps {
  productName?: string;
  colour?: string;
  size?: string;
  quantity?: number;
  orderId?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  productName,
  colour,
  size,
  quantity,
  orderId
}) => {
  const url = getWhatsAppOrderUrl({
    productName,
    colour,
    size,
    quantity,
    orderId
  });

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <a
        id="floating-whatsapp-btn"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold text-xs sm:text-sm group"
        aria-label="Order or Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">Order on WhatsApp</span>
      </a>
    </div>
  );
};
