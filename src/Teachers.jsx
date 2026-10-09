import { useEffect, useState } from 'react';
import { getTeachers, addTeacher, deleteTeacher } from './api';
import AddBox from './AddBox';

export default function Teachers() {
  const [list, setList] = useState([]);
  const load = () => getTeachers().then(setList).catch(() => setList([]));
  useEffect(() => { load(); }, []);

  return (
    <>
      <div className="block-head">
        <h3 className="block-title">Преподаватели</h3>
        <AddBox
          title="Новый преподаватель"
          fields={[{ name: 'name', placeholder: 'ФИО' }, { name: 'subject', placeholder: 'Предмет' }]}
          onSubmit={async (v) => { await addTeacher(v.name, v.subject); await load(); }}
        />
      </div>
      {list.map((t) => (
        <div key={t.id} className="teacher">
          <i />
          <div className="grow"><b>{t.name}</b><small>{t.subject}</small></div>
          <button className="x" aria-label="Удалить" onClick={async () => { await deleteTeacher(t.id); load(); }}>×</button>
        </div>
      ))}
    </>
  );
}