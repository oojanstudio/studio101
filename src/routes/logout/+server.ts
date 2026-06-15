import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

async function logout(locals: App.Locals) {
  await locals.supabase.auth.signOut();
}

export const GET: RequestHandler = async ({ locals }) => {
  await logout(locals);
  throw redirect(303, '/login');
};

export const POST: RequestHandler = async ({ locals }) => {
  await logout(locals);
  throw redirect(303, '/login');
};