export const API_BASE = 'http://localhost:8000';

export async function api(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts
  });
  if (!res.ok) throw new Error(await res.text().catch(()=>''));
  return res.status === 204 ? null : res.json();
}

