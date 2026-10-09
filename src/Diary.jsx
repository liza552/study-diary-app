import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks } from './api';
import BottomTabs from './BottomTabs';

const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const DOW = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
const iso = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

function buildCells(year, month) {
  const lead = (new Date(year, month, 1).getDay() + 6) % 7;
  const total = new Date(year, month + 1, 0).getDate();
  const cells = Array(lead).fill(null);
  for (let d = 1; d <= total; d++) cells.push({ day: d, off: [5, 6].includes((lead + d - 1) % 7) });
  return cells;
}

export default function Diary() {
  const navigate = useNavigate();
  const now = new Date();
  const [cur, setCur] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasks(cur.year, cur.month + 1).then(setTasks).catch(() => setTasks([]));
  }, [cur]);

  const byDate = useMemo(() => {
    const map = {};
    tasks.forEach((t) => (map[t.date] ??= []).push(t));
    return map;
  }, [tasks]);

  const shift = (n) => setCur(({ year, month }) => {
    const d = new Date(year, month + n, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const isToday = (d) => d === now.getDate() && cur.month === now.getMonth() && cur.year === now.getFullYear();

  return (
    <div className="diary">
      <header className="diary__head">
        <h1>Учебный дневник</h1>
        <div className="diary__tools">
          <button className="icon-btn" aria-label="Уведомления">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.3"><path d="M6 17V11a6 6 0 1112 0v6l2 2H4l2-2zM10 21h4"/></svg>
          </button>
          <button className="avatar icon-btn" aria-label="Профиль" onClick={() => navigate('/profile')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>
          </button>
        </div>
      </header>

      <div className="diary__bar">
        <h2 className="diary__month">{MONTHS[cur.month]} {cur.year}</h2>
        <div className="diary__nav">
          <button className="icon-btn" onClick={() => shift(-1)} aria-label="Предыдущий месяц">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M15 5l-7 7 7 7"/></svg>
          </button>
          <button className="icon-btn" onClick={() => shift(1)} aria-label="Следующий месяц">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>

      <section className="cal">
        <div className="cal__grid">
          {DOW.map((d) => <div key={d} className="cal__dow">{d}</div>)}
          {buildCells(cur.year, cur.month).map((c, i) => {
            if (!c) return <div key={i} />;
            const key = iso(cur.year, cur.month, c.day);
            const items = byDate[key] ?? [];
            const exam = items.some((t) => t.kind === 'exam');
            const rest = items.filter((t) => t.kind !== 'exam');
            return (
              <div key={i} className={`cal__cell${c.off ? ' cal__cell--off' : ''}${isToday(c.day) ? ' cal__cell--today' : ''}`}>
                <button className="cal__num" onClick={() => navigate(`/day/${key}`)}>{c.day}</button>
                {exam && <span className="tag">Экзамен</span>}
                {rest.length > 0 && (
                  <div className="dots">
                    {rest.slice(0, 3).map((t) => <span key={t.id} className={t.status}><i /><em>{t.title}</em></span>)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="legend">
        <span><i style={{ background: 'var(--ok)' }} />Есть время на сдачу</span>
        <span><i style={{ background: 'var(--soon)' }} />Скоро сдача</span>
        <span><i style={{ background: 'var(--late)' }} />Срок сдачи истекает</span>
      </div>

      <BottomTabs />
    </div>
  );
}