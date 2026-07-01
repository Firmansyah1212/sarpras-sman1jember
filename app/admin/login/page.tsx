'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError('Login gagal, periksa email/password');
    else router.push('/admin');
  };

  return (
    <div className="max-w-md mx-auto mt-20 card">
      <h1 className="text-2xl font-bold mb-4">Login Admin</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full border rounded-xl px-4 py-2"/>
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required className="w-full border rounded-xl px-4 py-2"/>
        <button type="submit" className="btn-primary w-full">Masuk</button>
      </form>
    </div>
  );
}
