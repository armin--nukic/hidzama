import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authStore } from '../../lib/auth';

const API_URL = import.meta.env.VITE_API_URL ?? '/api';

export function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@sifahidzama.ba');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) return setError('Invalid credentials');
    const data = await response.json();
    authStore.setToken(data.token);
    return navigate(data.user.role === 'STAFF' ? '/admin/posts' : '/admin');
  };

  return (
    <div className="grid min-h-screen place-items-center bg-sage px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-[8px] bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-bold">{t('admin.login')}</h1>
        <input className="mt-6 w-full rounded-[8px] border border-forest/20 p-3" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="mt-4 w-full rounded-[8px] border border-forest/20 p-3" type="password" placeholder="Lozinka" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="mt-5 rounded-full bg-forest px-6 py-3 font-bold text-white">Login</button>
        {error && <p className="mt-4 text-clay">{error}</p>}
      </form>
    </div>
  );
}
