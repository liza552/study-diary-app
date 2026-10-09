import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Diary from './Diary';
import Schedule from './Schedule';
import Day from './Day';
import SideLayout from './SideLayout';
import Profile from './Profile';
import Exams from './Exams';
import Teachers from './Teachers';
import Tasks from './Tasks';
import Stats from './Stats';

export default function App() {
  const [authed, setAuthed] = useState(() => !!localStorage.getItem('token'));
  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;

  return (
    <Routes>
      <Route path="/" element={<Diary />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/day/:date" element={<Day />} />
      <Route element={<SideLayout />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/stats" element={<Stats />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}