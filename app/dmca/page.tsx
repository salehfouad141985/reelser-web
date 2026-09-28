import { pageMetadata } from "@/lib/pageMetadata";

export const metadata = pageMetadata(
  "/dmca",
  "DMCA & Copyright Compliance",
  "Read Reelser's copyright policy and learn how copyright owners can submit a notice about content processed through the service.",
);

export default function DmcaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">DMCA & Copyright Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: September 2026</p>

      <div className="prose prose-pink max-w-none text-gray-700 space-y-6 text-sm sm:text-base leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">1. Notice of Non-Hosting</h2>
          <p>
            Reelser does not host, broadcast, or store any digital media files, videos, or photos on its web servers. All media accessed through this service is hosted on public content delivery networks (CDNs) maintained by Instagram and Meta Platforms, Inc.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">2. Respect for Intellectual Property</h2>
          <p>
            We strictly respect the intellectual property rights of creators and copyright owners. If you are a copyright owner or an agent thereof and believe that any content linked or processed through our service infringes upon your copyright, you may submit a notification pursuant to the Digital Millennium Copyright Act (&quot;DMCA&quot;).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">3. Takedown Requests</h2>
          <p>
            To submit an inquiry or takedown request, please provide the specific Instagram URL(s) involved along with evidence of your ownership or authorization to:
          </p>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm text-gray-800">
            Email: legal@reelser.com
          </div>
          <p>
            Upon receipt of a valid notice, we can implement URL filtering and block any identified links from being processed through our system.
          </p>
        </section>
      </div>
    </div>
  );
}
