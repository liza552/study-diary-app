const API = import.meta.env.VITE_API_URL ?? '/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(typeof err.detail === 'string' ? err.detail : 'Ошибка запроса');
  }
  return res.json();
}
const send = (method, path, body) =>
  request(path, { method, ...(body ? { body: JSON.stringify(body) } : {}) });

export const login = (login, password) => send('POST', '/auth/login', { login, password });

export const getTasks = (year, month) => request(`/tasks?year=${year}&month=${month}`);
export const getAllTasks = () => request('/tasks/all');
export const addTask = (title, due) => send('POST', '/tasks', { title, due });
export const toggleTask = (id) => send('POST', `/tasks/${id}/toggle`);
export const deleteTask = (id) => send('DELETE', `/tasks/${id}`);

export const getSchedule = (weekday) => request(`/schedule?weekday=${weekday}`);
export const addLesson = (lesson) => send('POST', '/schedule', lesson);
export const deleteLesson = (id) => send('DELETE', `/schedule/${id}`);

export const getDay = (date) => request(`/day?date=${date}`);
export const saveNote = (date, text) => send('PUT', '/day/note', { date, text });

export const getProfile = () => request('/profile');
export const saveProfile = (p) => send('PUT', '/profile', p);

export const getExams = () => request('/exams');
export const addExam = (subject, date) => send('POST', '/exams', { subject, date });
export const gradeExam = (id, grade) => send('POST', `/exams/${id}/grade`, { grade });
export const deleteExam = (id) => send('DELETE', `/exams/${id}`);

export const getTeachers = () => request('/teachers');
export const addTeacher = (name, subject) => send('POST', '/teachers', { name, subject });
export const deleteTeacher = (id) => send('DELETE', `/teachers/${id}`);

export const getStats = () => request('/stats');