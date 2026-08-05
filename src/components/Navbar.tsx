// Navbar.tsx
import { useCallback, useEffect, useState } from 'react';
import './Navbar.css';
import { Menu, X } from 'lucide-react';
import { lenisRef } from '../lib/lenisInstance';

interface NavLink {
  label: string;
  target: string;
}

// Label dibuat singkat (beda dari label ScrollDownButton yang panjang &
// naratif) karena ini dipakai berulang di navbar, bukan cuma sekali per
// section.
const NAV_LINKS: NavLink[] = [
  { label: 'Home', target: '.hero' },
  { label: 'Carbon Core', target: '.brand-story' },
  { label: 'Tungsten Point', target: '.product-highlights' },
  { label: 'Spin Wing Vanes', target: '.specs' },
  { label: 'Nock', target: '.nock' },
  { label: 'Gallery', target: '.gallery' },
  { label: 'Pricing', target: '.pricing-section' },
  { label: 'Contact', target: '.cta-footer' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTarget, setActiveTarget] = useState<string>('.hero');

  // Latar navbar menggelap + blur begitu halaman mulai discroll, supaya
  // teks link tetap terbaca walau section di baliknya terang/berubah-ubah.
  // Saat masih di paling atas (di atas Hero), navbar dibiarkan transparan.
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll-spy sederhana pakai IntersectionObserver: nandain link mana yang
  // "aktif" sesuai section yang lagi berada di area tengah viewport.
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

    lenisRef.current?.scrollTo(el, {
      offset: 0,
      duration: 1.4,
    });
    setIsMenuOpen(false);
  }, []);

  return (
    <header className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <button
          type="button"
          className="navbar__logo"
          onClick={() => handleNavClick('.hero')}
          aria-label="Kembali ke atas halaman"
        >
          GOTECH
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
