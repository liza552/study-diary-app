import { useEffect, useState } from 'react';
import { getExams, addExam, gradeExam, deleteExam } from './api';
import AddBox from './AddBox';

const daysLeft = (iso) => Math.ceil((new Date(iso + 'T00:00:00') - new Date().setHours(0, 0, 0, 0)) / 86400000);
const plural = (n) => (n % 10 === 1 && n % 100 !== 11 ? 'день' : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? 'дня' : 'дней');
const level = (n) => (n <= 5 ? 'late' : n <= 14 ? 'soon' : 'ok');
const fmt = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

export default function Exams() {
  const [data, setData] = useState({ upcoming: [], passed: [] });
  const load = () => getExams().then(setData).catch(() => setData({ upcoming: [], passed: [] }));
  useEffect(() => { load(); }, []);

  return (
    <>
      <div className="block-head">
        <h3 className="block-title">Предстоят</h3>
        <AddBox
          title="Новый экзамен"
          fields={[{ name: 'subject', placeholder: 'Предмет' }, { name: 'date', type: 'date' }]}
          onSubmit={async (v) => { await addExam(v.subject, v.date); await load(); }}
        />
      </div>
      {data.upcoming.length === 0 && <p className="empty">Экзаменов нет. Нажмите «+», чтобы добавить.</p>}
      {data.upcoming.map((e) => {
        const n = daysLeft(e.date);
        return (
          <div key={e.id} className="exam">
            <div className={`days ${n < 0 ? 'late' : level(n)}`}>{n < 0 ? 'прошёл' : <>{n}<br />{plural(n)}</>}</div>
            <div className="grow"><b>{e.subject}</b><small>{fmt(e.date)}</small></div>
            <select
              className="grade-sel"
              value=""
              onChange={async (ev) => { if (ev.target.value) { await gradeExam(e.id, ev.target.value); load(); } }}
            >
              <option value="">Оценка…</option>
              <option>Отлично</option>
              <option>Хорошо</option>
              <option>Удовлетворительно</option>
            </select>
            <button className="x" aria-label="Удалить" onClick={async () => { await deleteExam(e.id); load(); }}>×</button>
          </div>
        );
      })}

      <h3 className="block-title">Сданы</h3>
      {data.passed.length === 0 && <p className="empty">Пока нет</p>}
      {data.passed.map((e) => (
        <div key={e.id} className="passed">
          <span className="ok-mark">✓</span>
          <b>{e.subject}</b>
          <span>{e.grade}</span>
          <button className="x" aria-label="Удалить" onClick={async () => { await deleteExam(e.id); load(); }}>×</button>
        </div>
      ))}
    </>
  );
}