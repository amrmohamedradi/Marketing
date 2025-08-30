import { useEffect, useState } from 'react';

const cache = new Map();
function keyOf(from,to,txt){ return `${from}->${to}:${txt}`; }

export function usePreviewTranslate(spec, lang, enable=false) {
  const [resolved, setResolved] = useState(spec);
  useEffect(() => {
    if (!enable || !spec) { setResolved(spec); return; }
    const other = lang === 'ar' ? 'en' : 'ar';
    const jobs = [];
    const paths = [];
    const push = (path, src) => { if (src) { jobs.push(src); paths.push(path); } };

    // collect missing fields across previewed parts (client/services/support/pricing if exist)
    if (spec?.client?.name && !spec.client.name?.[lang] && (spec.client.name?.[other])) push(['client','name'], spec.client.name[other]);
    if (spec?.client?.company && !spec.client.company?.[lang] && (spec.client.company?.[other])) push(['client','company'], spec.client.company[other]);
    if (spec?.client?.summary && !spec.client.summary?.[lang] && (spec.client.summary?.[other])) push(['client','summary'], spec.client.summary[other]);

    (spec?.services||[]).forEach((s,si)=>{
      if (s?.title && !s.title?.[lang] && (s.title?.[other])) push(['services',si,'title'], s.title[other]);
      (s.items||[]).forEach((it,ij)=>{
        if (it?.text && !it.text?.[lang] && (it.text?.[other])) push(['services',si,'items',ij,'text'], it.text[other]);
      });
    });

    (spec?.support?.items||[]).forEach((it,i)=>{
      if (it?.text && !it.text?.[lang] && (it.text?.[other])) push(['support','items',i,'text'], it.text[other]);
    });

    if (!jobs.length) { setResolved(spec); return; }

    async function run(){
      const from = other, to = lang;
      const ask = [], idx = [];
      jobs.forEach((t,i)=>{
        const k = keyOf(from,to,t);
        if (!cache.has(k)) { ask.push(t); idx.push(i); }
      });

      if (ask.length){
        try{
          const r = await fetch('/api/translate', {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ q: ask, from, to })
          });
          const j = await r.json();
          (j?.translations||[]).forEach((tx,ii)=> cache.set(keyOf(from,to,ask[ii]), tx));
        }catch{/* ignore */}
      }

      const out = structuredClone ? structuredClone(spec) : JSON.parse(JSON.stringify(spec));
      jobs.forEach((t,i)=>{
        const tx = cache.get(keyOf(from,to,t));
        if (!tx) return;
        let ref = out;
        const p = paths[i];
        for (let k=0;k<p.length-1;k++) ref = ref[p[k]];
        const last = p[p.length-1];
        ref[last] = { ...(ref[last]||{}), [to]: tx };
      });
      setResolved(out);
    }
    run();
  }, [JSON.stringify(spec), lang, enable]);

  return resolved;
}
