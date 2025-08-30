import { useEffect, useState } from 'react';

// caches translations by simple key (lang + text)
const cache = new Map();

export function useAutoTranslateMissing(services, lang, { enable = false } = {}) {
  const [resolved, setResolved] = useState(services);

  useEffect(() => {
    if (!enable) { setResolved(services); return; }

    const other = lang === 'ar' ? 'en' : 'ar';
    const jobs = [];
    services.forEach((s, si) => {
      if (s?.title?.[other] && !s?.title?.[lang]) {
        jobs.push({ type: 'title', si, text: s.title[other] });
      }
      (s.items || []).forEach((it, ij) => {
        const t = it?.text || {};
        if (t[other] && !t[lang]) jobs.push({ type: 'item', si, ij, text: t[other] });
      });
    });
    if (!jobs.length) { setResolved(services); return; }

    async function run() {
      // check cache
      const toAsk = [];
      const fromIdx = [];
      jobs.forEach((j, k) => {
        const key = `${other}->${lang}:${j.text}`;
        if (!cache.has(key)) { toAsk.push(j.text); fromIdx.push(k); }
      });

      let translations = [];
      if (toAsk.length) {
        try {
          const r = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q: toAsk, from: other, to: lang })
          });
          const j = await r.json();
          translations = j?.translations || [];
          translations.forEach((tx, i) => cache.set(`${other}->${lang}:${toAsk[i]}`, tx));
        } catch {
          setResolved(services); return;
        }
      }

      // build output with cached values
      const out = services.map(s => ({ ...s, items: (s.items || []).map(it => ({ ...it })) }));
      jobs.forEach((job) => {
        const key = `${other}->${lang}:${job.text}`;
        const tx = cache.get(key);
        if (!tx) return;
        if (job.type === 'title') {
          out[job.si].title = { ...(out[job.si].title || {}), [lang]: tx };
        } else {
          out[job.si].items[job.ij].text = { ...(out[job.si].items[job.ij].text || {}), [lang]: tx };
        }
      });
      setResolved(out);
    }
    run();
  }, [JSON.stringify(services), lang, enable]);

  return resolved;
}
