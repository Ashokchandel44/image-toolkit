import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../utils/constants';

function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" to="/">
          <span className="brand-mark">IT</span>
          <span>
            <strong>ImageToolkit</strong>
            <small>Browser-only image tools</small>
          </span>
        </Link>
        <nav aria-label="Primary navigation" className="main-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
