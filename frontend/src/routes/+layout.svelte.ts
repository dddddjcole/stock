import type { LayoutServerLoad } from './$types';
import { API_BASE } from '$lib/api';

export const load: LayoutServerLoad = async ({ fetch, cookies }) => {
  const session = cookies.get('session');
  if (!session) return { user: null };
  try {
    const r = await fetch(`${API_BASE}/api/auth/me?session=${encodeURIComponent(session)}`, {
      credentials: 'include'
    });
    if (!r.ok) return { user: null };
    const user = await r.json();
    return { user };
  } catch {
    return { user: null };
  }
};

