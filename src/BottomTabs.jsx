import { Link, useLocation } from 'react-router-dom';

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export default function BottomTabs() {
  const { pathname } = useLocation();
  const tabs = [
    { to: '/', label: 'Главная', on: pathname === '/', icon: <path d="M3 11l9-8 9 8v10H3z" /> },
    {
      to: `/day/${todayIso()}`, label: 'Заметки и задачи', on: pathname.startsWith('/day'),
      icon: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></>,
    },
    {
      to: '/schedule', label: 'Расписание', on: pathname === '/schedule',
      icon: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
    },
    { to: '/stats', label: 'Статистика', on: pathname === '/stats', icon: <path d="M6 20V10M12 20V4M18 20v-8" /> },
  ];

  return (
    <nav className="tabs" aria-label="Разделы">
      {tabs.map((t) => (
        <Link key={t.to} to={t.to} aria-label={t.label} aria-current={t.on ? 'page' : undefined}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">{t.icon}</svg>
        </Link>
      ))}
    </nav>
  );
}