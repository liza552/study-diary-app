import { useState } from 'react';
import { login } from './api';

export default function Login({ onSuccess }) {
  const [form, setForm] = useState({ login: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit() {
    setBusy(true); setError('');
    try {
      const { token } = await login(form.login, form.password);
      localStorage.setItem('token', token);
      onSuccess();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="login">
      <div className="login__card">
        <h1 className="login__title">Вход</h1>
        <p className="login__hint">Пожалуйста, авторизируйтесь, чтобы продолжить</p>

        <label className="field">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>
          <input name="login" placeholder="Логин" autoComplete="username" value={form.login} onChange={change} />
        </label>
        <label className="field">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/></svg>
          <input name="password" type="password" placeholder="Пароль" autoComplete="current-password"
                 value={form.password} onChange={change} onKeyDown={(e) => e.key === 'Enter' && submit()} />
        </label>

        {error && <p className="login__error" role="alert">{error}</p>}
        <button className="login__btn" onClick={submit} disabled={busy || !form.login || !form.password}>
          Войти
        </button>
      </div>
    </main>
  );
}