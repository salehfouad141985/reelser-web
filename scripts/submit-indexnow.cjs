const fs = require("node:fs");
const path = require("node:path");

const INDEXNOW_KEY = "d2d6601146b940e29a2a0a7337c93bbb";
const HOST = "reelser.com";
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

function extractSlugsFromFile(relativePath) {
  try {
    const content = fs.readFileSync(path.join(__dirname, "..", relativePath), "utf8");
    return [...content.matchAll(/slug:\s*["']([^"']+)["']|"slug":\s*"([^"]+)"/g)]
      .map((m) => m[1] || m[2])
      .filter(Boolean);
  } catch {
    return [];
  }
}

function buildLocalSitemapUrls() {
  const coreUrls = [
    `https://${HOST}`,
    `https://${HOST}/ar`,
    `https://${HOST}/es`,
    `https://${HOST}/pt`,
    `https://${HOST}/fr`,
    `https://${HOST}/tr`,
    `https://${HOST}/id`,
    `https://${HOST}/de`,
    `https://${HOST}/ru`,
    `https://${HOST}/reels`,
    `https://${HOST}/story-saver`,
    `https://${HOST}/photo-downloader`,
    `https://${HOST}/audio-downloader`,
    `https://${HOST}/profile-downloader`,
    `https://${HOST}/terms`,
    `https://${HOST}/privacy`,
    `https://${HOST}/dmca`,
  ];

  const enSlugs = extractSlugsFromFile("lib/pseo-data.ts").map((s) => `https://${HOST}/${s}`);
  const arSlugs = extractSlugsFromFile("lib/pseo-ar-data.ts").map((s) => `https://${HOST}/ar/${s}`);
  const esSlugs = extractSlugsFromFile("lib/pseo-es-data.ts").map((s) => `https://${HOST}/es/${s}`);
  const ptSlugs = extractSlugsFromFile("lib/pseo-pt-data.ts").map((s) => `https://${HOST}/pt/${s}`);
  const frSlugs = extractSlugsFromFile("lib/pseo-fr-data.ts").map((s) => `https://${HOST}/fr/${s}`);
  const trSlugs = extractSlugsFromFile("lib/pseo-tr-data.ts").map((s) => `https://${HOST}/tr/${s}`);
  const idSlugs = extractSlugsFromFile("lib/pseo-id-data.ts").map((s) => `https://${HOST}/id/${s}`);
  const deSlugs = extractSlugsFromFile("lib/pseo-de-data.ts").map((s) => `https://${HOST}/de/${s}`);
  const ruSlugs = extractSlugsFromFile("lib/pseo-ru-data.ts").map((s) => `https://${HOST}/ru/${s}`);

  return Array.from(
    new Set([
      ...coreUrls,
      ...enSlugs,
      ...arSlugs,
      ...esSlugs,
      ...ptSlugs,
      ...frSlugs,
      ...trSlugs,
      ...idSlugs,
      ...deSlugs,
      ...ruSlugs,
    ])
  );
}

async function fetchSitemapUrls() {
  const localUrls = buildLocalSitemapUrls();
  console.log(`Built ${localUrls.length} local sitemap URLs. Checking remote https://${HOST}/sitemap.xml ...`);
  try {
    const res = await fetch(`https://${HOST}/sitemap.xml`, {
      headers: { "User-Agent": "Reelser-IndexNow/1.0" },
    });
    if (res.ok) {
      const xml = await res.text();
      const remoteUrls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
      if (remoteUrls.length > 0) {
        return Array.from(new Set([...localUrls, ...remoteUrls]));
      }
    }
  } catch (e) {
    console.warn("Could not fetch remote sitemap, using complete local URLs list:", e.message);
  }

  return localUrls;
}

async function submitToIndexNow() {
  const urlList = await fetchSitemapUrls();
  console.log(`Found ${urlList.length} URLs to submit for ${HOST}.`);

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  const endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
  ];

  for (const endpoint of endpoints) {
    console.log(`\nSubmitting to ${endpoint}...`);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      console.log(`Response Status: ${response.status} ${response.statusText}`);
      if (response.status === 200 || response.status === 202) {
        console.log(`SUCCESS: ${urlList.length} URLs submitted successfully to ${endpoint}!`);
      } else {
        const text = await response.text();
        console.warn(`Response Body: ${text}`);
      }
    } catch (err) {
      console.error(`Error submitting to ${endpoint}:`, err.message);
    }
  }
}

submitToIndexNow();
