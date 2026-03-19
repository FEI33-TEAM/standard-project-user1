import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="page-content" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <div style={{ fontSize: '4rem' }}>🚗💨</div>
      <h1>404 — Сторінку не знайдено</h1>
      <p style={{ marginBottom: '1.5rem' }}>
        Здається, ця сторінка поїхала на розмитнення і ще не повернулась.
      </p>
      <Link to="/" className="btn btn-primary">← На головну</Link>
    </main>
  );
}
