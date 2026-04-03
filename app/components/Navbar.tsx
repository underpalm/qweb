'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={`navbar${scrolled ? ' navbar-scrolled' : ''}`}>
        <a href="#" className="navbar-logo" onClick={closeMenu}>
          <Image src="/logo.png" alt="Qradient Logo" width={160} height={48} style={{ objectFit: 'contain' }} />
        </a>

        {/* Desktop links */}
        <ul className="nav-links nav-links-desktop">
          <li><a href="#services">Services</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        {/* Desktop CTA */}
        <a href="mailto:info@qradient.com" className="nav-cta-btn nav-cta-desktop">Get Started</a>

        {/* Hamburger */}
        <button
          className={`hamburger${menuOpen ? ' hamburger-open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu${menuOpen ? ' mobile-menu-open' : ''}`}>
        <a href="#services" className="mobile-link" onClick={closeMenu}>Services</a>
        <a href="#about" className="mobile-link" onClick={closeMenu}>About</a>
        <a href="#contact" className="mobile-link" onClick={closeMenu}>Contact</a>
        <a href="mailto:info@qradient.com" className="nav-cta-btn mobile-cta" onClick={closeMenu}>Get Started</a>
      </div>
    </>
  );
}
