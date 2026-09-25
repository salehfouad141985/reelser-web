const fs = require('fs');

const INDEXNOW_KEY = "d2d6601146b940e29a2a0a7337c93bbb";
const HOST = "reelser.com";
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

async function fetchSitemapUrls() {
  console.log(`Fetching live sitemap from https://${HOST}/sitemap.xml ...`);
  try {
    const res = await fetch(`https://${HOST}/sitemap.xml`, {
      headers: { "User-Agent": "Reelser-IndexNow/1.0" }
    });
    if (res.ok) {
      const xml = await res.text();
      const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
      if (urls.length > 0) {
        return Array.from(new Set(urls));
      }
    }
  } catch (e) {
    console.warn("Could not fetch remote sitemap, falling back to base URLs list:", e.message);
  }

  // Fallback list of primary URLs
  return [
    `https://${HOST}`,
    `https://${HOST}/reels`,
    `https://${HOST}/story-saver`,
    `https://${HOST}/photo-downloader`,
    `https://${HOST}/audio-downloader`,
    `https://${HOST}/profile-downloader`,
    `https://${HOST}/terms`,
    `https://${HOST}/privacy`,
    `https://${HOST}/dmca`
  ];
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
    "https://www.bing.com/indexnow"
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
