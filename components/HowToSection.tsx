"use client";

import React from "react";
import { useLanguage } from "./LanguageProvider";
import { Copy, ArrowRight, Download, Link2 } from "lucide-react";

export function HowToSection() {
  const { t } = useLanguage();

  const steps = [
    {
      num: "01",
      icon: Copy,
      title: t("step1Title"),
      desc: t("step1Desc"),
    },
    {
      num: "02",
      icon: Link2,
      title: t("step2Title"),
      desc: t("step2Desc"),
    },
    {
      num: "03",
      icon: Download,
      title: t("step3Title"),
      desc: t("step3Desc"),
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
            Quick & Simple
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-3">
            {t("howToTitle")}
          </h2>
          <p className="mt-4 text-base text-gray-600">
            Save any Instagram Reel, Video, or Story to your device in 3 quick steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-white p-8 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 font-bold">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-gray-200">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
