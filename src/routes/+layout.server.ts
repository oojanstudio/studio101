import { page } from '$app/state';
import type { User } from '@supabase/supabase-js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  let user: User | null = null;
  return { user };

  // const session = await locals.safeGetSession();
  // user = session.user;
  // console.log('Layout load function called. User:', user); // Debug log to check if user is being retrieved correctly
  // return { user };
};