const fs = require('node:fs/promises');
const path = require('node:path');
const urls = ['http://reelser.com/', 'http://www.reelser.com/', 'https://www.reelser.com/', 'https://reelser.com/',
  'https://reelser.com/audio-downloader', 'https://reelser.com/anonymous-instagram-story-viewer',
  'https://reelser.com/download-instagram-reels', 'https://reelser.com/robots.txt', 'https://reelser.com/sitemap.xml'];
(async () => {
  const results = [];
  for (const input of urls) {
    const row = { input, checkedAt: new Date().toISOString(), chain: [] };
    try {
      let current = input;
      for (let hop = 0; hop < 5; hop++) {
        const response = await fetch(current, { redirect: 'manual', signal: AbortSignal.timeout(15000) });
        const location = response.headers.get('location');
        row.chain.push({ url: current, status: response.status, ...(location ? { location } : {}) });
        if (response.status >= 300 && response.status < 400 && location) {
          await response.body?.cancel(); current = new URL(location, current).href; continue;
        }
        const text = await response.text();
        row.final = current;
        row.canonical = text.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1];
        row.h1 = text.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, ' ').trim();
        row.metaRobots = text.match(/<meta[^>]*name="robots"[^>]*content="([^"]+)"/i)?.[1];
        row.headerRobots = response.headers.get('x-robots-tag');
        if (input.endsWith('/robots.txt')) row.robots = text;
        if (input.endsWith('/sitemap.xml')) row.sitemapCount = (text.match(/<loc>/g) || []).length;
        break;
      }
    } catch (error) { row.errorType = error.name; row.networkCode = error.cause?.code; }
    results.push(row); console.log(JSON.stringify(row));
  }
  await fs.writeFile(path.join(__dirname, 'indexing-url-results.json'), JSON.stringify(results, null, 2) + '\n');
})().catch(() => { console.error('URL check failed'); process.exitCode = 1; });
