'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.message || 'Passcode tidak valid');
      }
    } catch {
      setError('Terjadi kesalahan koneksi server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white font-black text-2xl shadow-lg shadow-blue-500/30">
            G
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Growfin Admin Dashboard
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Masukkan Admin Passcode untuk mengelola data mitra klinik
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              🔒 Admin Passcode
            </label>
            <input
              type="password"
              placeholder="Masukkan passcode admin..."
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full rounded-2xl bg-slate-800 border border-slate-700 px-4 py-3 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-blue-600/30 disabled:opacity-50 transition-all"
          >
            {loading ? 'Memverifikasi...' : 'Masuk ke Dashboard Admin ➔'}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-[11px] text-slate-500">
            Default Passcode: <code className="text-blue-400 bg-slate-800 px-2 py-0.5 rounded">growfin2026</code>
          </p>
        </div>
      </div>
    </div>
  );
}
