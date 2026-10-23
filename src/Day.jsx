import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDay, toggleTask, addTask, deleteTask, saveNote } from './api';
import BottomTabs from './BottomTabs';
import AddBox from './AddBox';
import useNoIndex from './useNoIndex';


const LABEL = { soon: 'скоро сдача', late: 'срок сдачи истекает' };

export default function Day() {
  const { date } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ tasks: [], exams: [], files: [] });
  const [note, setNote] = useState('');

  useNoIndex();

  const load = () =>
    getDay(date)
      .then((r) => { setData(r); setNote(r.note); })
      .catch(() => setData({ tasks: [], exams: [], files: [] }));

  useEffect(() => { load(); }, [date]);

  const d = new Date(date + 'T00:00:00');
  const title = `${d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}, ${d.toLocaleDateString('ru-RU', { weekday: 'long' })}`;

  return (
    <div className="page">
      <main className="page__body">
        <button className="back" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M15 5l-7 7 7 7" /></svg>
          {title}
        </button>

        <h3 className="block-title">Заметка</h3>
        <textarea
          className="note-edit"
          placeholder="Добавить заметку на этот день"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => saveNote(date, note).catch(() => {})}
          rows={2}
        />

        <div className="block-head">
          <h3 className="block-title">Задачи</h3>
          <AddBox
            title="Новая задача"
            fields={[{ name: 'title', placeholder: 'Что нужно сделать' }]}
            onSubmit={async (v) => { await addTask(v.title, date); await load(); }}
          />
        </div>
        {data.exams.map((e) => (
          <div key={e.id} className="task task--exam">
            <span className="task__t">Экзамен: {e.subject}</span>
            <span className="pill late">экзамен</span>
          </div>
        ))}
        {data.tasks.length === 0 && data.exams.length === 0 && <p className="empty">Задач нет. Нажмите «+», чтобы добавить.</p>}
        {data.tasks.map((t) => (
          <div key={t.id} className={`task${!t.done && t.status !== 'ok' ? ' task--tag' : ''}${t.done ? ' task--done' : ''}`}>
            <button className={`check${t.done ? ' check--on' : ''}`} aria-label="Выполнено" onClick={async () => { await toggleTask(t.id); load(); }}>
              {t.done ? '✓' : ''}
            </button>
            <span className="task__t">{t.title}</span>
            {!t.done && LABEL[t.status] && <span className={`pill ${t.status}`}>{LABEL[t.status]}</span>}
            <button className="x" aria-label="Удалить" onClick={async () => { await deleteTask(t.id); load(); }}>×</button>
          </div>
        ))}

        <h3 className="block-title">Файлы</h3>
        {data.files.length === 0 && <p className="empty">Файлов нет</p>}
        {data.files.map((f) => (
          <div key={f.id} className="task">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6c70c9" strokeWidth="1.6"><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4" /></svg>
            <span className="task__t">{f.name}</span>
          </div>
        ))}
      </main>
      <BottomTabs />
    </div>
  );
}