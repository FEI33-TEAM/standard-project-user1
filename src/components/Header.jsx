import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/',              label: 'Головна' },
  { to: '/customs-duty',  label: 'Мито' },
  { to: '/excise-tax',    label: 'Акциз' },
  { to: '/total-cost',    label: 'Повний розрахунок' },
  { to: '/about',         label: 'Про сервіс' },
  { to: '/faq',           label: 'FAQ' },
];

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <NavLink to="/" className="header-logo">
          🚗 АвтоМито
        </NavLink>
        <nav className="header-nav">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
