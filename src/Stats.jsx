import { useEffect, useState } from 'react';
import { getStats } from './api';

export default function Stats() {
  const [s, setS] = useState(null);
  useEffect(() => { getStats().then(setS).catch(() => setS(null)); }, []);

  if (!s) return <p className="empty">Загрузка...</p>;
  const pct = s.tasks_total ? Math.round((s.tasks_done / s.tasks_total) * 100) : 0;

  return (
    <>
      <h3 className="block-title">Выполнение заданий</h3>
      <div className="bar"><div className="bar__fill" style={{ width: `${pct}%` }} /></div>
      <p className="note">{s.tasks_done} из {s.tasks_total} выполнено ({pct}%)</p>

      <div className="cards">
        <div className="card"><b>{s.exams_passed}</b><span>экзаменов сдано</span></div>
        <div className="card"><b>{s.exams_upcoming}</b><span>экзаменов впереди</span></div>
        <div className="card"><b>{s.avg_grade ?? '—'}</b><span>средний балл</span></div>
      </div>
    </>
  );
}