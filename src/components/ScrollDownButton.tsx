import './ScrollDownButton.css';
import { ChevronDown } from 'lucide-react';
import { lenisRef } from '../lib/lenisInstance';
import type { ScrollDownButtonProps } from '../types/components/ScrollDownButton';

const ScrollDownButton = ({ target, label = 'Scroll ke section berikutnya' }: ScrollDownButtonProps) => {
  const handleClick = () => {
    const el = document.querySelector<HTMLElement>(target);
    if (!el) return;

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
