import { env } from '$env/dynamic/public';

const DEFAULT_API_BASE = 'http://localhost:8000';
const configuredBase = env.PUBLIC_API_BASE?.trim();
const normalizedBase = (configuredBase && configuredBase.length > 0 ? configuredBase : DEFAULT_API_BASE).replace(/\/$/, '');
export const API_BASE = normalizedBase;

export async function api(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts
  });
  if (!res.ok) throw new Error(await res.text().catch(()=>''));
  return res.status === 204 ? null : res.json();
}

