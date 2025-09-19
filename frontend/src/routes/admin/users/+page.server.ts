import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { API_BASE } from '$lib/api';

export const load: PageServerLoad = async ({ parent, fetch }) => {
  const { user } = await parent();
  if (!user) throw redirect(302, '/login');
  if (!['owner','admin'].includes(user.role)) throw redirect(302, '/dashboard');

  const r = await fetch(`${API_BASE}/api/users`, { credentials: 'include' });
  const users = r.ok ? await r.json() : [];
  return { user, users };
};

