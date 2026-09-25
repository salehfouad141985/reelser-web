import type { Metadata } from "next";

export const metadata: Metadata = {
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
          <h2 className="text-xl font-bold text-gray-900 mb-2">1. No Personal Information Collected</h2>
          <p>
            Reelser does not require user registration, login credentials, or personal identification. We do not ask for or store Instagram usernames, passwords, or personal details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">2. No Media Retention</h2>
          <p>
            Reelser does not store, archive, or retain copies of downloaded videos, reels, stories, or photos on our servers. Media streams are processed transiently in real time and passed directly to your client browser.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">3. Logs & Analytics</h2>
          <p>
            Like standard web services, our servers may collect non-personally identifiable technical logs (such as browser user agent, IP address for rate limiting, and timestamp) strictly to prevent abuse and maintain server availability.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">4. Cookies</h2>
          <p>
            We may use minimal local storage cookies solely to remember your preferred language selection across visits.
          </p>
        </section>
      </div>
    </div>
  );
}
