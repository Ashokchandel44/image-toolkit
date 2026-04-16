import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../utils/constants';

const SITE_LOGO = 'https://travelwithanki.com/wp-content/uploads/2024/06/cropped-asd.png';

function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" to="/">
          <span className="brand-mark">
            <img src={SITE_LOGO} alt="Travel With Anki logo" />
          </span>
          <span>
            <strong>ImageToolkit</strong>
            <small>Browser-only image tools</small>
          </span>
        </Link>
        <nav aria-label="Primary navigation" className="main-nav">
          {NAV_ITEMS.map((item) =>
            item.external ? (
              <a key={item.href} href={item.href} target="_blank" rel="noreferrer" className="nav-link nav-link-external">
                {item.label}
              </a>
            ) : (
              <NavLink key={item.path} to={item.path} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                {item.label}
              </NavLink>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
