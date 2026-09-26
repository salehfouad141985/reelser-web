import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
  title: "Privacy Policy",
  description: "Privacy Policy of Reelser - How we protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: September 2026</p>

      <div className="prose prose-pink max-w-none text-gray-700 space-y-6 text-sm sm:text-base leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">1. Information Used to Process Requests</h2>
          <p>
            Reelser does not ask for Instagram passwords or require visitor registration. Submitted links and usernames are sent to Instagram and public extraction services to retrieve media. Temporary media links are stored for up to 15 minutes and expired entries are removed during subsequent requests.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">2. No Media Retention</h2>
          <p>
            Media is buffered temporarily to validate its type and size. Audio conversion uses a temporary local file that is removed after processing. Process crashes can leave temporary files for the hosting operator to clean up. We do not maintain a media archive.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">3. Logs & Analytics</h2>
          <p>
            The application stores aggregate request counts and the latest 30 generic activity events without submitted usernames or titles. Rate limits use hashed client identifiers when a trusted proxy is configured; expired counters are removed on subsequent requests. Hosting providers may maintain their own access logs. Google Analytics is not loaded by the application. Configured advertisements may contact third-party providers from isolated frames.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">4. Cookies</h2>
          <p>
            Your language preference is stored locally in your browser. Administrators receive a secure session cookie that expires after one day; sessions are revoked on logout or password change.
          </p>
        </section>
      </div>
    </div>
  );
}
