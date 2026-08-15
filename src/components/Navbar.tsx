import { useCallback, useEffect, useState } from 'react';
import './Navbar.css';
import { Menu, X } from 'lucide-react';
import { lenisRef } from '../lib/lenisInstance';
import type { NavLink } from '../types/components/Navbar';

const NAV_LINKS: NavLink[] = [
  { label: 'Beranda', target: '.hero' },
  { label: 'Shaft', target: '.brand-story' },
  { label: 'Point', target: '.product-highlights' },
  { label: 'Vanes', target: '.specs' },
  { label: 'Nock', target: '.nock' },
  { label: 'Dokumentasi', target: '.gallery' },
  { label: 'Series', target: '.pricing-section' },
  { label: 'Kontak', target: '.cta-footer' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTarget, setActiveTarget] = useState<string>('.hero');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS
      .map((link) => document.querySelector<HTMLElement>(link.target))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const match = NAV_LINKS.find(
            (link) => document.querySelector(link.target) === entry.target
          );
          if (match) setActiveTarget(match.target);
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = useCallback((target: string) => {
    const el = document.querySelector<HTMLElement>(target);
    if (!el) return;

    const currentIndex = NAV_LINKS.findIndex((link) => link.target === activeTarget);
    const targetIndex = NAV_LINKS.findIndex((link) => link.target === target);

    const stepDifference = Math.abs(targetIndex - currentIndex) || 1; 
    const durationPerStep = 2; 

    const calculatedDuration = stepDifference * durationPerStep;

    lenisRef.current?.scrollTo(el, {
      offset: 0,
      duration: calculatedDuration,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    setIsMenuOpen(false);
  }, [activeTarget]);

  return (
    <header className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <button
          type="button"
          className="navbar__logo"
          onClick={() => handleNavClick('.hero')}
          aria-label="Kembali ke atas halaman"
        >
          <img src="/img/logo/gotech-logo-white.svg" alt="GoTech Logo" className="navbar__logo-img" />
        </button>

        <nav className="navbar__links" aria-label="Navigasi utama">
          {NAV_LINKS.map((link) => (
            <button
              key={link.target}
              type="button"
              className={`navbar__link ${activeTarget === link.target ? 'is-active' : ''}`}
              onClick={() => handleNavClick(link.target)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="navbar__toggle"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
        </button>
      </div>

      <nav
        className={`navbar__mobile-menu ${isMenuOpen ? 'is-open' : ''}`}
        aria-label="Navigasi mobile"
      >
        {NAV_LINKS.map((link) => (
          <button
            key={link.target}
            type="button"
            className={`navbar__mobile-link ${activeTarget === link.target ? 'is-active' : ''}`}
            onClick={() => handleNavClick(link.target)}
          >
            {link.label}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default Navbar;