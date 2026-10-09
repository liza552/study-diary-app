import { useState } from 'react';

export default function AddBox({ title, fields, onSubmit }) {
  const empty = () => Object.fromEntries(fields.map((f) => [f.name, f.value ?? '']));
  const [open, setOpen] = useState(false);
  const [vals, setVals] = useState(empty);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      await onSubmit(vals);
      setVals(empty());
      setError('');
      setOpen(false);
    } catch (err) {
      setError(err.message);
    }
  }

  if (!open) {
    return <button className="plus" onClick={() => setOpen(true)} aria-label={title} title={title}>+</button>;
  }

  return (
    <form className="addbox" onSubmit={submit}>
      <b>{title}</b>
      {fields.map((f) =>
        f.options ? (
          <select key={f.name} value={vals[f.name]} onChange={(e) => setVals({ ...vals, [f.name]: e.target.value })}>
            {f.options.map((o) => <option key={o}>{o}</option>)}
          </select>
        ) : (
          <input
            key={f.name}
            type={f.type ?? 'text'}
            placeholder={f.placeholder}
            required={f.required ?? true}
            value={vals[f.name]}
            onChange={(e) => setVals({ ...vals, [f.name]: e.target.value })}
          />
        )
      )}
      {error && <span className="addbox__err">{error}</span>}
      <div className="addbox__row">
        <button type="submit" className="btn">Добавить</button>
        <button type="button" className="btn btn--ghost" onClick={() => setOpen(false)}>Отмена</button>
      </div>
    </form>
  );
}