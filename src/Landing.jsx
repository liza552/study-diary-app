import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <main className="login">
      <div className="login__card">
        <h1 className="login__title">Учебный дневник</h1>
        <p className="login__hint">Календарь сдачи заданий, расписание, заметки и экзамены студента в одном месте.</p>
        <h2 className="landing__h2">Что внутри</h2>
        <ul className="landing__list">
          <li>Календарь с экзаменами и сроками сдачи</li>
          <li>Расписание занятий на неделю</li>
          <li>Заметки, задачи и файлы на каждый день</li>
          <li>Оценки за экзамены и статистика</li>
        </ul>
        <Link className="landing__link" to="/login">Войти</Link>
      </div>
    </main>
  );
}