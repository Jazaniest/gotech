import { useEffect, useState } from 'react';
import './Loader.css';
import type { LoaderProps } from '@/types/components/loader.';

const Loader = ({ ready }: LoaderProps) => {
  const [opening, setOpening] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const openTimer = setTimeout(() => setOpening(true), 250);
    return () => clearTimeout(openTimer);
  }, [ready]);

  useEffect(() => {
    if (!opening) return;
    const removeTimer = setTimeout(() => setRemoved(true), 950);
    return () => clearTimeout(removeTimer);
  }, [opening]);

  useEffect(() => {
    document.documentElement.classList.toggle('is-loading', !opening);
    return () => document.documentElement.classList.remove('is-loading');
  }, [opening]);

  if (removed) return null;

  return (
    <div className={`curtain${opening ? ' curtain--open' : ''}`} aria-hidden={opening}>
      <div className="curtain__panel curtain__panel--left" />
      <div className="curtain__panel curtain__panel--right" />
      <div className="curtain__brand">
        <span>GOTECH</span>
      </div>
    </div>
  );
};

export default Loader;
