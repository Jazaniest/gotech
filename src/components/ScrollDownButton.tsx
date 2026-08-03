import './ScrollDownButton.css';
import { ChevronDown } from 'lucide-react';
import { lenisRef } from '../lib/lenisInstance';

interface ScrollDownButtonProps {
  /** CSS selector section tujuan, mis. ".brand-story" */
  target: string;
  /** Label aksesibilitas, disesuaikan per section biar jelas tujuannya */
  label?: string;
}

const ScrollDownButton = ({ target, label = 'Scroll ke section berikutnya' }: ScrollDownButtonProps) => {
  const handleClick = () => {
    const el = document.querySelector<HTMLElement>(target);
    if (!el) return;

    // Lenis.scrollTo() secara default menyelaraskan bagian ATAS elemen
    // dengan atas viewport. Supaya section tujuan langsung tampil di
    // TENGAH layar (bukan cuma rata atas), kita tambahkan offset negatif
    // sebesar setengah dari sisa ruang viewport di luar tinggi elemen.
    // Kalau elemen lebih tinggi dari viewport, offset ini otomatis jadi
    // positif - scroll sedikit lebih jauh supaya titik tengah elemen yang
    // dipusatkan, bukan bagian atasnya.
    const offset = -(window.innerHeight - el.offsetHeight) / 2;

    lenisRef.current?.scrollTo(el, {
      offset,
      duration: 1.4,
    });
  };

  return (
    <button
      type="button"
      className="scroll-down-btn"
      onClick={handleClick}
      aria-label={label}
    >
      <ChevronDown size={22} strokeWidth={2} />
    </button>
  );
};

export default ScrollDownButton;
