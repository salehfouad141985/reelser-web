"use client";
import { createContext, useContext, useEffect, useState } from "react";
interface Settings { maintenance: boolean; banners: Partial<Record<"top" | "results" | "bottom", string>> }
const Context = createContext<Settings>({ maintenance: false, banners: {} });
export function SiteSettings({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({ maintenance: false, banners: {} });
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/site-settings", { signal: controller.signal, cache: "no-store" })
      .then(response => response.json()).then(setSettings).catch(() => {});
    return () => controller.abort();
  }, []);
  return <Context.Provider value={settings}>{children}</Context.Provider>;
}
export function useSiteSettings() { return useContext(Context); }
export function AdBanner({ position }: { position: "top" | "results" | "bottom" }) {
  const { banners, maintenance } = useSiteSettings();
  if (maintenance || !banners[position]) return null;
  return <iframe title="Advertisement" sandbox="allow-scripts allow-popups" referrerPolicy="no-referrer"
    srcDoc={banners[position]} className="w-full max-w-5xl mx-auto h-28 border-0" />;
}
