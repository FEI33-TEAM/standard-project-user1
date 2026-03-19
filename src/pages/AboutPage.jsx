import { Link } from 'react-router-dom';

const steps = [
  'Знайди авто на міжнародному майданчику (наприклад, Copart, IAAI, AutoBid).',
  'Дізнайся точну митну вартість авто у митного брокера або на сайті ДМС.',
  'Скористайся нашим калькулятором для орієнтовного розрахунку всіх платежів.',
  'Зверніться до ліцензованого митного брокера для офіційного оформлення.',
  'Сплати всі збори — і авто готово до реєстрації в Україні!',
];

export default function AboutPage() {
  return (
    <main className="page-content">
      <div className="stub-banner">
        <span>🚧</span>
        <span>Ця сторінка є заглушкою — чудове місце для твоєї першої задачі!</span>
      </div>

      <div className="card">
        <h1>Про сервіс АвтоМито</h1>
        <p>
          <strong>АвтоМито</strong> — це навчальний проект на React, який демонструє
          базові концепції: компоненти, стан, роутинг, форми та умовний рендеринг.
          Паралельно він є корисним інструментом для тих, хто хоче зрозуміти,
          скільки коштує розмитнення авто в Україні.
        </p>

        <h2 style={{ marginTop: '1.5rem' }}>Як відбувається розмитнення?</h2>
        <ol className="about-steps">
          {steps.map((step, i) => (
            <li key={i}><span>{step}</span></li>
          ))}
        </ol>

        <h2 style={{ marginTop: '1.5rem' }}>Технічний стек</h2>
        <table className="info-table">
          <thead>
            <tr>
              <th>Технологія</th>
              <th>Призначення</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>React 19</td><td>UI-компоненти та стан</td></tr>
            <tr><td>React Router v7</td><td>Клієнтський роутинг</td></tr>
            <tr><td>Vite 8</td><td>Збірка та dev-сервер</td></tr>
            <tr><td>CSS Custom Properties</td><td>Темізація та стилі</td></tr>
          </tbody>
        </table>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/total-cost" className="btn btn-primary">
            🧮 Спробувати калькулятор
          </Link>
          <Link to="/faq" className="btn btn-secondary">
            ❓ Читати FAQ
          </Link>
        </div>
      </div>
    </main>
  );
}
