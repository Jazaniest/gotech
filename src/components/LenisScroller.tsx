// LenisScroller.tsx
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

    // invalidate() di sini (bukan di gsap.ticker) sengaja - ticker jalan
    // TERUS tiap frame walau user diam, sedangkan event 'scroll' Lenis
    // cuma nembak saat posisi scroll BENAR-BENAR berubah. Dengan
    // frameloop="demand" di Canvas (lihat Scene.tsx), canvas cuma perlu
    // re-render pas ada perubahan beneran - invalidate() di sini yang
    // jadi sinyal itu, jadi GPU diam saat user tidak scroll.
    lenis.on('scroll', () => {
      ScrollTrigger.update();
      invalidate();
    });

    // Supaya Lenis dan ScrollTrigger selalu "sepakat" soal tinggi halaman -
    // tiap kali ScrollTrigger.refresh() jalan, Lenis ikut resize().
    //
    // invalidate() ditempel di sini juga (bukan di tiap tempat yang
    // manggil ScrollTrigger.refresh()) karena event 'refresh' ini
    // GLOBAL - ke-fire otomatis dari refresh() manapun di seluruh app,
    // termasuk yang di useScrollAnimation.ts & useHeroArrowsAnimation.ts.
    // Satu listener di sini sudah cover semuanya - refresh() bisa
    // mengubah posisi kamera/arrow tanpa lewat event 'scroll' (mis. pas
    // breakpoint berubah), jadi canvas tetap perlu di-invalidate manual.
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