import { useEffect, useState } from 'react';
import { getAllTasks, addTask, toggleTask, deleteTask } from './api';
import AddBox from './AddBox';

const LABEL = { soon: 'скоро сдача', late: 'срок сдачи истекает' };
const fmt = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

export default function Tasks() {
  const [list, setList] = useState([]);
  const load = () => getAllTasks().then(setList).catch(() => setList([]));
  useEffect(() => { load(); }, []);

  return (
    <>
      <div className="block-head">
        <h3 className="block-title">Все задания</h3>
        <AddBox
          title="Новое задание"
          fields={[{ name: 'title', placeholder: 'Что нужно сделать' }, { name: 'due', type: 'date' }]}
          onSubmit={async (v) => { await addTask(v.title, v.due); await load(); }}
        />
      </div>
      {list.length === 0 && <p className="empty">Заданий нет. Нажмите «+», чтобы добавить.</p>}
      {list.map((t) => (
        <div key={t.id} className={`task${t.done ? ' task--done' : ''}`}>
          <button className={`check${t.done ? ' check--on' : ''}`} aria-label="Выполнено" onClick={async () => { await toggleTask(t.id); load(); }}>
            {t.done ? '✓' : ''}
          </button>
          <span className="task__t">{t.title}</span>
          <small className="task__date">{fmt(t.due)}</small>
          {!t.done && LABEL[t.status] && <span className={`pill ${t.status}`}>{LABEL[t.status]}</span>}
          <button className="x" aria-label="Удалить" onClick={async () => { await deleteTask(t.id); load(); }}>×</button>
        </div>
      ))}
    </>
  );
}