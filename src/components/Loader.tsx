import { useEffect, useState } from 'react';
import './Loader.css';

interface LoaderProps {
  /** true begitu scene 3D (termasuk environment map) selesai siap */
  ready: boolean;
}

const Loader = ({ ready }: LoaderProps) => {
  const [opening, setOpening] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    if (!ready) return;
    // Jeda kecil sebelum tirai dibuka - biar transisinya kerasa
    // disengaja/branded, bukan cuma "kedip" begitu asset selesai load.
    const openTimer = setTimeout(() => setOpening(true), 250);
    return () => clearTimeout(openTimer);
  }, [ready]);

  useEffect(() => {
    if (!opening) return;
    // Lepas elemen dari DOM setelah animasi geser (900ms di CSS) selesai,
    // supaya tidak nyangkut nutupin klik/scroll walau sudah transparan.
    const removeTimer = setTimeout(() => setRemoved(true), 950);
    return () => clearTimeout(removeTimer);
  }, [opening]);

  useEffect(() => {
    // Kunci scroll halaman selama tirai masih menutup, biar user tidak
    // "curi start" scroll sebelum arrow-nya benar-benar tampil.
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
