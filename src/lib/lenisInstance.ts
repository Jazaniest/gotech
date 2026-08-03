// lenisInstance.ts
import type Lenis from 'lenis';

// Wrapper object (bukan variabel biasa) supaya nilainya bisa di-reassign
// dari LenisScroller.tsx setelah modul ini di-import di tempat lain -
// import ES module itu live-binding utk named export, tapi lebih aman &
// eksplisit pakai object holder begini.
export const lenisRef: { current: Lenis | null } = { current: null };
