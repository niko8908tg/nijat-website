import fs from 'fs';

const html = fs.readFileSync('c:/projects/NicatWebsite/Training _ Pedro Araújo.html', 'utf8');

const matches = html.matchAll(/<astro-island[^>]+component-url="[^"]*Training[^"]*"[^>]*props="([^"]+)"/g);
for (const match of matches) {
  const decoded = match[1].replace(/&quot;/g, '"');
  const parsed = JSON.parse(decoded);

  function unwrap(t) {
    if (t === null || typeof t !== 'object') return t;
    if (Array.isArray(t)) {
      const kind = t[0];
      const val = t[1];
      if (kind === 0) return unwrap(val);
      if (kind === 1) return val.map(unwrap);
      if (kind === 3) return new Date(val);
    }
    return Object.fromEntries(Object.entries(t).map(([k, v]) => [k, unwrap(v)]));
  }

  const cleanData = {
    rawActivities: unwrap(parsed.rawActivities),
    trainingStatus: unwrap(parsed.trainingStatus),
    sleepData: unwrap(parsed.sleepData),
    bodyComp: unwrap(parsed.bodyComp),
    sleepHistory: unwrap(parsed.sleepHistory),
  };

  fs.writeFileSync('c:/projects/NicatWebsite/src/trainingDataParsed.json', JSON.stringify(cleanData, null, 2));
  console.log('Clean data saved successfully! Activities count:', cleanData.rawActivities.length);
}
