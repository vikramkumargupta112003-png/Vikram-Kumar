import React, { useState } from 'react';
import { SIZE_CHART } from '../types';
import { X, Ruler, CheckCircle2 } from 'lucide-react';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSize?: string;
  onSelectSize?: (size: any) => void;
}

export const SizeChartModal: React.FC<SizeChartModalProps> = ({
  isOpen,
  onClose,
  selectedSize,
  onSelectSize
}) => {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  if (!isOpen) return null;

  return (
    <div id="size-chart-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-zinc-900" />
            <h3 className="text-base font-bold text-zinc-900">
              Plain Round Neck T-Shirt Size Guide
            </h3>
          </div>
          <button
            id="close-size-chart"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Unit Toggle */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-500">
              All measurements are taken flat across the garment. Regular comfort fit.
            </p>
            <div className="flex items-center p-0.5 bg-zinc-100 rounded-lg border border-zinc-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setUnit('inches')}
                className={`px-3 py-1 rounded-md transition-colors ${unit === 'inches' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'}`}
              >
                Inches
              </button>
              <button
                type="button"
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 rounded-md transition-colors ${unit === 'cm' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'}`}
              >
                Centimeters
              </button>
            </div>
          </div>

          {/* Size Table */}
          <div className="overflow-x-auto rounded-xl border border-zinc-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-100 text-xs font-bold text-zinc-700 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Chest ({unit === 'inches' ? 'in' : 'cm'})</th>
                  <th className="px-4 py-3">Length ({unit === 'inches' ? 'in' : 'cm'})</th>
                  <th className="px-4 py-3">Shoulder ({unit === 'inches' ? 'in' : 'cm'})</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {SIZE_CHART.map((item) => {
                  const isSelected = selectedSize === item.size;
                  return (
                    <tr 
                      key={item.size}
                      className={`hover:bg-zinc-50/80 transition-colors ${isSelected ? 'bg-amber-50/50 font-medium' : ''}`}
                    >
                      <td className="px-4 py-3.5 font-bold text-zinc-900 flex items-center gap-1.5">
                        <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-900 text-white text-xs">
                          {item.size}
                        </span>
                        {isSelected && <span className="text-[11px] text-amber-700 font-semibold">(Selected)</span>}
                      </td>
                      <td className="px-4 py-3.5 text-zinc-700">
                        {unit === 'inches' ? `${item.chestInches}"` : `${item.chestCm} cm`}
                      </td>
                      <td className="px-4 py-3.5 text-zinc-700">
                        {unit === 'inches' ? `${item.lengthInches}"` : `${item.lengthCm} cm`}
                      </td>
                      <td className="px-4 py-3.5 text-zinc-700">
                        {unit === 'inches' ? `${item.shoulderInches}"` : `${item.shoulderCm} cm`}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {onSelectSize ? (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectSize(item.size);
                              onClose();
                            }}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                              isSelected
                                ? 'bg-zinc-900 text-white'
                                : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                            }`}
                          >
                            {isSelected ? 'Chosen' : 'Select'}
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Measurement Advice */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-200/80 text-xs text-zinc-600">
            <div>
              <span className="font-bold text-zinc-800 block mb-0.5">1. Chest:</span>
              Measure around the fullest part of your chest, keeping tape horizontal.
            </div>
            <div>
              <span className="font-bold text-zinc-800 block mb-0.5">2. Length:</span>
              Measure from highest point of the shoulder down to the bottom hemline.
            </div>
            <div>
              <span className="font-bold text-zinc-800 block mb-0.5">3. Shoulder:</span>
              Measure straight across from one shoulder seam tip to the other.
            </div>
          </div>

          {/* Fit Guarantee info */}
          <div className="flex items-center gap-2 text-xs text-zinc-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>7-Day Easy Exchange Guarantee:</strong> If the size does not fit comfortably, you can request an exchange within 7 days of delivery.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-zinc-100 border-t border-zinc-200 flex justify-end">
          <button
            id="done-size-chart"
            onClick={onClose}
            className="px-4 py-2 bg-zinc-900 text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
