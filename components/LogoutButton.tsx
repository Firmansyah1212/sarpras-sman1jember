// components/LogoutButton.tsx
'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-white border border-gray-300 rounded-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition flex items-center gap-2"
    >
      <i className="fas fa-right-from-bracket"></i>
      Keluar
    </button>
  );
}