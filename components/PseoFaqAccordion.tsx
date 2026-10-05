"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { PseoFaq } from "@/lib/pseo-data";

export function PseoFaqAccordion({ faqs }: { faqs: PseoFaq[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {faqs.map((faq, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div
            key={idx}
            className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-2xs transition-colors"
          >
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-900 hover:text-pink-600 transition-colors gap-4"
              aria-expanded={isOpen}
            >
              <span className="flex items-center gap-3 text-base sm:text-lg">
                <HelpCircle className="w-5 h-5 text-pink-600 shrink-0" />
                <span>{faq.q}</span>
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0 ${
                  isOpen ? "rotate-180 text-pink-600" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-sm sm:text-base text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
