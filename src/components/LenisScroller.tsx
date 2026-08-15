import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { invalidate } from '@react-three/fiber';
import { lenisRef } from '../lib/lenisInstance';

gsap.registerPlugin(ScrollTrigger);

const LenisScroller = () => {
  useEffect(() => {
    const lenis = new Lenis();
    lenisRef.current = lenis;

    lenis.on('scroll', () => {
      ScrollTrigger.update();
      invalidate();
    });

    const handleRefresh = () => {
      lenis.resize();
      invalidate();
    };
    ScrollTrigger.addEventListener('refresh', handleRefresh);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

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