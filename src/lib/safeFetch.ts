export async function safeFetch(input: string, init: RequestInit = {}) {
  const res = await fetch(input, {
    headers: { 
      Accept: 'application/json', 
      ...(init.headers || {}) 
    },
    ...init,
  });
  
  const text = await res.text();
  let data = null;
  
  try { 
    data = text ? JSON.parse(text) : null; 
  } catch {
    // JSON parse failed, keep data as null
  }
  
  if (!res.ok) {
    const msg = data?.message || data?.error || text || res.statusText || 'Request failed';
    const err = new Error(msg) as any;
    err.status = res.status;
    err.body = text;
    throw err;
  }
  
  return data ?? { ok: true };
}
