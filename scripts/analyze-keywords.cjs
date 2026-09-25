const fs = require('fs');

const file = 'C:/Users/saleh14/.gemini/antigravity/brain/6c8c14fc-84b9-4e5a-b259-254150f890b9/.user_uploaded/media_1790331000083.csv';
const buffer = fs.readFileSync(file);
const text = buffer.toString('utf16le');
const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

const keywords = [];
for (let i = 3; i < lines.length; i++) {
  const parts = lines[i].split('\t');
  if (parts.length >= 3) {
    const kw = parts[0].trim().toLowerCase();
    const volume = parseInt(parts[2].replace(/[^0-9]/g, ''), 10) || 0;
    if (kw && volume > 0) {
      keywords.push({ kw, volume });
    }
  }
}

keywords.sort((a, b) => b.volume - a.volume);
console.log('Total valid keywords with volume:', keywords.length);

console.log('\nTop 40 keywords by search volume:');
keywords.slice(0, 40).forEach((k, idx) => {
  console.log(`${idx + 1}. ${k.kw} -> ${k.volume.toLocaleString()} searches/mo`);
});

const downloaderTerms = ['download', 'saver', 'save', 'mp4', 'mp3', 'converter', 'reels', 'story', 'stories', 'photo', 'video', 'dp', 'pfp', 'without watermark', 'no watermark'];
const relevant = keywords.filter(k => downloaderTerms.some(t => k.kw.includes(t)));
console.log('\nTotal downloader-relevant keywords:', relevant.length);
const totalVolume = relevant.reduce((acc, k) => acc + k.volume, 0);
console.log('Total monthly search volume of relevant keywords:', totalVolume.toLocaleString());
