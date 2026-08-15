import './CTAFooter.css';
import { MapPin, Phone } from 'lucide-react';

const TikTokIcon = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const CTAFooter = () => {
  return (
    <footer className="cta-footer">
      <div className="cta-content">
        <h2>Siap untuk Meningkatkan Permainan Anda?</h2>
        <a 
          href="https://wa.me/6281234567890" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="cta-button"
        >
          Hubungi Kami
        </a>
      </div>

      <div className="footer-info">
        <div className="footer-location">
          <MapPin size={18} className="info-icon" />
          <span>Pekanbaru, Riau, Indonesia</span>
        </div>

        <div className="social-links">
          <a 
            href="https://wa.me/6281268007639" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >
            <Phone size={20} />
            <span>WhatsApp</span>
          </a>
          <a 
            href="https://www.tiktok.com/@ujangkidalujang" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="TikTok"
          >
            <TikTokIcon size={20} />
            <span>TikTok</span>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} GoTech. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default CTAFooter;