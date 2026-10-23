import { useEffect, useState } from 'react';
import { getSchedule, addLesson, deleteLesson } from './api';
import BottomTabs from './BottomTabs';
import AddBox from './AddBox';
import useNoIndex from './useNoIndex';

const DOW = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const mins = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };

function weekDays() {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export default function Schedule() {
  const days = weekDays();
  const todayIdx = (new Date().getDay() + 6) % 7;
  const [sel, setSel] = useState(todayIdx);
  const [lessons, setLessons] = useState([]);

  useNoIndex();

  const load = () =>
    getSchedule(sel)
      .then((r) => setLessons([...r].sort((a, b) => mins(a.time_from) - mins(b.time_from))))
      .catch(() => setLessons([]));

  useEffect(() => { load(); }, [sel]);

  const n = new Date();
  const nowMin = n.getHours() * 60 + n.getMinutes();
  const isNow = (l) => sel === todayIdx && nowMin >= mins(l.time_from) && nowMin < mins(l.time_to);

  return (
    <div className="page">
      <main className="page__body">
        <div className="page__head">
          <h1 className="page__title">Расписание</h1>
          <AddBox
            title="Добавить занятие"
            fields={[
              { name: 'title', placeholder: 'Предмет' },
              { name: 'kind', options: ['Лекция', 'Практическая', 'Лабораторная'], value: 'Лекция' },
              { name: 'time_from', type: 'time', value: '08:30' },
              { name: 'time_to', type: 'time', value: '10:20' },
            ]}
            onSubmit={async (v) => { await addLesson({ ...v, weekday: sel }); await load(); }}
          />
        </div>

        <div className="week">
          {days.map((d, i) => (
            <button key={i} className={`week__day${i === sel ? ' week__day--on' : ''}`} onClick={() => setSel(i)}>
              <span>{DOW[i]}</span>
              <b>{d.getDate()}</b>
            </button>
          ))}
        </div>

        {lessons.length === 0 && <p className="empty">В этот день занятий нет. Нажмите «+», чтобы добавить.</p>}
        <ul className="lessons">
          {lessons.map((l) => (
            <li key={l.id} className={`lesson${isNow(l) ? ' lesson--now' : ''}`}>
              <div className="lesson__time"><span>{l.time_from}</span><span>{l.time_to}</span></div>
              <i className={`lesson__bar ${l.color}`} />
              <div className="grow"><b>{l.title}</b><small>{l.kind}</small></div>
              <button className="x" aria-label="Удалить" onClick={async () => { await deleteLesson(l.id); load(); }}>×</button>
            </li>
          ))}
        </ul>
      </main>
      <BottomTabs />
    </div>
  );
}