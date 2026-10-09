import { useEffect, useState } from 'react';
import { getProfile, saveProfile } from './api';

const FIELDS = [
  ['name', 'Имя для отображения'],
  ['full_name', 'ФИО'],
  ['city', 'Город'],
  ['college', 'Учебное заведение'],
  ['years', 'Годы обучения'],
  ['grp', 'Группа'],
];

export default function Profile() {
  const [p, setP] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { getProfile().then(setP).catch(() => setP(null)); }, []);

  if (!p) return <p className="empty">Загрузка...</p>;

  async function save(e) {
    e.preventDefault();
    try {
      await saveProfile(form);
      setP(form);
      setEdit(false);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  if (edit) {
    return (
      <form className="editform" onSubmit={save}>
        {FIELDS.map(([key, label]) => (
          <label key={key}>
            <span>{label}</span>
            <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          </label>
        ))}
        <label>
          <span>О себе</span>
          <textarea rows={3} value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} />
        </label>
        {error && <span className="addbox__err">{error}</span>}
        <div className="addbox__row">
          <button className="btn" type="submit">Сохранить</button>
          <button className="btn btn--ghost" type="button" onClick={() => setEdit(false)}>Отмена</button>
        </div>
      </form>
    );
  }

  return (
    <>
      <div className="me">
        <div className="me__ava">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.4"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
        </div>
        <div className="grow">
          <h2>{p.name}</h2>
          <p>{p.college}</p>
          <p>{p.years}</p>
        </div>
        <button className="btn btn--ghost" onClick={() => { setForm(p); setEdit(true); }}>Редактировать</button>
      </div>

      <h3 className="block-title">Личная информация</h3>
      <dl className="info">
        <dt>ФИО</dt><dd>{p.full_name}</dd>
        <dt>Город</dt><dd>{p.city}</dd>
        <dt>Учебное заведение</dt><dd>{p.college}</dd>
        <dt>Годы обучения</dt><dd>{p.years}</dd>
        <dt>Группа</dt><dd>{p.grp}</dd>
      </dl>

      <h3 className="block-title">О себе</h3>
      <p className="note">{p.about}</p>
    </>
  );
}