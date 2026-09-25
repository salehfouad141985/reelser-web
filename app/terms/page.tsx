import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and Conditions of using Reelser.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: September 2026</p>

      <div className="prose prose-pink max-w-none text-gray-700 space-y-6 text-sm sm:text-base leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Reelser (https://reelser.com), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">2. Permitted Use & Copyright</h2>
          <p>
            Reelser is a utility provided solely for personal, non-commercial use. Users are strictly responsible for respecting the copyright and intellectual property rights of content owners. You agree not to download or distribute copyrighted content without explicit authorization from the legitimate copyright holder.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">3. Disclaimer of Affiliation</h2>
          <p>
            Reelser is an independent third-party web application and is not affiliated, endorsed, certified, or sponsored by Instagram, Meta Platforms, Inc., or any of their affiliates or subsidiaries.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">4. Disclaimer of Warranties</h2>
          <p>
            The service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied. Reelser does not host, store, or archive any media files on its servers; all downloads are processed via real-time streams directly from source public CDNs.
          </p>
        </section>
      </div>
    </div>
  );
}
