import { Link } from 'react-router-dom';

const calculators = [
  {
    to:    '/customs-duty',
    icon:  '📋',
    title: 'Калькулятор мита',
    desc:  'Розрахуй суму митного збору залежно від об\'єму двигуна та віку авто',
  },
  {
    to:    '/excise-tax',
    icon:  '💰',
    title: 'Калькулятор акцизу',
    desc:  'Дізнайся розмір акцизного податку за об\'ємом двигуна та роком випуску',
  },
  {
    to:    '/total-cost',
    icon:  '🧮',
    title: 'Повний розрахунок',
    desc:  'Всі збори разом: мито + акциз + ПДВ + пенсійний фонд',
  },
];

export default function HomePage() {
  return (
    <main className="page-content">
      {/* Hero banner */}
      <section className="hero">
        <h1>Розмитнення авто в Україні</h1>
        <p>
          Безкоштовні калькулятори для розрахунку митних платежів при ввезенні
          автомобіля в Україну. Введи параметри авто — отримай орієнтовну суму.
        </p>
        <div className="hero-cards">
          {calculators.map(({ to, icon, title, desc }) => (
            <Link key={to} to={to} className="hero-card">
              <div className="icon">{icon}</div>
              <div className="title">{title}</div>
              <div className="desc">{desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Info block */}
      <div className="card">
        <h2>Що потрібно знати перед розрахунком?</h2>
        <p>
          При ввезенні авто до України сплачуються кілька видів обов&apos;язкових платежів.
          Ставки залежать від об&apos;єму двигуна та терміну експлуатації авто.
        </p>

        <table className="info-table">
          <thead>
            <tr>
              <th>Платіж</th>
              <th>База нарахування</th>
              <th>Ставка (орієнтовно)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Мито (ввізне)</td>
              <td>Митна вартість авто</td>
              <td>10% (до 5 р.) / 15% (5–7 р.) / 20% (7+ р.)</td>
            </tr>
            <tr>
              <td>Акцизний податок</td>
              <td>Об&apos;єм двигуна (куб. см)</td>
              <td>від €0.109 до €2.209 за куб. см</td>
            </tr>
            <tr>
              <td>ПДВ</td>
              <td>Мит. вартість + мито + акциз</td>
              <td>20%</td>
            </tr>
            <tr>
              <td>Пенсійний фонд</td>
              <td>Митна вартість авто</td>
              <td>3%</td>
            </tr>
          </tbody>
        </table>

        <p style={{ fontSize: '.85rem', color: 'var(--text)' }}>
          ⚠️ Дані є орієнтовними. Точні ставки уточнюй на сайті Державної митної служби.
        </p>
      </div>
    </main>
  );
}
