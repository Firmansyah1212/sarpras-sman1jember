'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.replace('/admin/login');
    router.refresh();
  };

  return (
    <button
      onClick={logout}
      className="rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700"
    >
      Logout
    </button>
  );
}