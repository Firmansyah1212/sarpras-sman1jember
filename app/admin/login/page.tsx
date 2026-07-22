'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginAdmin() {
  const router = useRouter();

  // Supabase dibuat SATU KALI
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  


  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
  console.error(error);
  setError(error.message);
  setLoading(false);
  return;
}

    router.replace('/admin');
  };

  return (
  <div
    className="relative flex min-h-screen items-center justify-center bg-cover bg-center p-4"
    style={{
      backgroundImage: "url('/bg_sekolah.jpg')",
    }}
  >
    {/* Overlay */}
    <div className="absolute inset-0 bg-black/45"></div>

    {/* Card Login */}
    <div
      className="
        relative
        w-full
        max-w-md
        rounded-3xl
        border
        border-white/30
        bg-white/90
        p-6
        shadow-[0_0_60px_rgba(59,130,246,0.45)]
        backdrop-blur-md
        sm:p-8
      "
    >
      {/* Logo */}
      <div className="mb-8 text-center">
        <img
          src="/Logo.png"
          alt="Logo SMAN 1 Jember"
          className="mx-auto h-20 w-20 object-contain drop-shadow-xl sm:h-24 sm:w-24"
        />

        <h1 className="mt-4 text-xl font-bold text-gray-800 sm:text-2xl">
          Sistem Peminjaman
        </h1>

        <p className="text-sm font-semibold text-blue-600 sm:text-base">
          Sarana & Prasarana
        </p>

        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          SMA Negeri 1 Jember
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Masukkan email"
            className="
              w-full
              rounded-xl
              border
              border-gray-300
              px-4
              py-3
              text-sm
              outline-none
              transition
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-200
              sm:text-base
            "
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Password
          </label>

          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
            className="
              w-full
              rounded-xl
              border
              border-gray-300
              px-4
              py-3
              text-sm
              outline-none
              transition
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-200
              sm:text-base
            "
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            rounded-xl
            bg-gradient-to-r
            from-blue-600
            to-indigo-700
            py-3
            text-sm
            font-semibold
            text-white
            transition-all
            duration-300
            hover:scale-[1.02]
            hover:shadow-xl
            disabled:cursor-not-allowed
            disabled:opacity-70
            sm:text-base
          "
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 border-t border-gray-200 pt-4 text-center">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} SMA Negeri 1 Jember
        </p>
      </div>
    </div>
  </div>
);
}