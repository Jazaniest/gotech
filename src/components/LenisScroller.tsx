// LenisScroller.tsx
import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { lenisRef } from '../lib/lenisInstance';

gsap.registerPlugin(ScrollTrigger);

const LenisScroller = () => {
  useEffect(() => {
    const lenis = new Lenis();
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    // Supaya Lenis dan ScrollTrigger selalu "sepakat" soal tinggi halaman -
    // tiap kali ScrollTrigger.refresh() jalan, Lenis ikut resize().
    const handleRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener('refresh', handleRefresh);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Refresh sekali sekarang, dan sekali lagi setelah SEMUA asset
    // (termasuk hero.png) benar-benar selesai load - supaya start/end
    // trigger dihitung dari tinggi halaman yang final, bukan yang sementara.
    ScrollTrigger.refresh();
    const refreshScrollTrigger = () => ScrollTrigger.refresh();
    window.addEventListener('load', refreshScrollTrigger);

    return () => {
      gsap.ticker.remove(update);
      ScrollTrigger.removeEventListener('refresh', handleRefresh);
      window.removeEventListener('load', refreshScrollTrigger);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return null;
};

export default LenisScroller;