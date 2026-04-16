import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const socialLinks = [
    { label: 'GitHub', href: 'https://github.com/Ashokchandel44' },
    { label: 'Facebook', href: 'https://www.facebook.com/anku.chandel.50' },
    { label: 'Instagram', href: 'https://www.instagram.com/travelwithanki_' },
    { label: 'X', href: 'https://x.com/poisonkinganki' },
    { label: 'YouTube', href: 'https://www.youtube.com/@Travelwithanki1' },
    { label: 'Pinterest', href: 'https://in.pinterest.com/travelwithanki' },
  ];

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Compress', path: '/compress-image' },
    { label: 'Resize', path: '/resize-image' },
    { label: 'Convert', path: '/convert-image' },
    { label: 'Calculators', href: 'https://travelwithanki.com/calculators/' },
  ];

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src="https://travelwithanki.com/wp-content/uploads/2024/06/cropped-asd.png" alt="Travel With Anki logo" />
          <div>
            <h3>ImageToolkit</h3>
            <p>Fast browser-only image tools by Travel With Anki.</p>
          </div>
        </div>

        <div>
          <h4>Quick links</h4>
          <div className="footer-links">
            {quickLinks.map((item) =>
              item.href ? (
                <a key={item.href} href={item.href} target="_blank" rel="noreferrer">
                  {item.label}
                </a>
              ) : (
                <Link key={item.path} to={item.path}>
                  {item.label}
                </Link>
              ),
            )}
          </div>
        </div>

        <div>
          <h4>Follow us</h4>
          <div className="footer-social">
            {socialLinks.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>Copyright {new Date().getFullYear()} Travel With Anki. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
