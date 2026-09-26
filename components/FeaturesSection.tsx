"use client";

import React from "react";
import { useLanguage } from "./LanguageProvider";
import { ShieldCheck, Sparkles, Zap, Smartphone } from "lucide-react";

export function FeaturesSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: ShieldCheck,
      title: t("feature1Title"),
      desc: t("feature1Desc"),
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: Sparkles,
      title: t("feature2Title"),
      desc: t("feature2Desc"),
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: Zap,
      title: t("feature3Title"),
      desc: t("feature3Desc"),
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Smartphone,
      title: "All Devices Supported",
      desc: "Optimized for seamless operation across iPhone (iOS Safari), Android (Chrome), Mac, Windows, and Linux.",
      color: "from-blue-500 to-cyan-500",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
            Top Quality & Security
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-3">
            {t("featuresTitle")}
          </h2>
          <p className="mt-4 text-base text-gray-600">
            Reelser is engineered specifically for Instagram lovers who want instant, reliable, and pristine media downloads without friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="relative p-6 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-pink-200 hover:shadow-lg transition-all group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feature.color} flex items-center justify-center text-white mb-5 shadow-md shadow-pink-500/10 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
