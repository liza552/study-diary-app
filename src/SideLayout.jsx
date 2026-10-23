import { NavLink, Outlet } from 'react-router-dom';
import BottomTabs from './BottomTabs';
import useNoIndex from './useNoIndex';


export default function SideLayout() {
  useNoIndex();
  return (
    <div className="side">
      <div className="side__wrap">
        <nav className="side__nav">
          <h1>Учебный дневник</h1>
          <NavLink to="/" end>Главная</NavLink>
          <NavLink to="/profile">Профиль</NavLink>
          <NavLink to="/tasks">Задания</NavLink>
          <NavLink to="/exams">Экзамены</NavLink>
          <NavLink to="/teachers">Преподаватели</NavLink>
          <NavLink to="/stats">Статистика</NavLink>
        </nav>
        <section className="panel">
          <Outlet />
        </section>
      </div>
      <BottomTabs />
    </div>
  );
}