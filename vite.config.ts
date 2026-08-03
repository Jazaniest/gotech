import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Chunk Three.js/@react-three (sekarang dipisah via React.lazy() di
    // App.tsx) memang secara wajar > 500kB - itu sifat library 3D, bukan
    // tanda ada yang salah. Naikkan limit-nya biar warning cuma muncul
    // kalau ada chunk lain yang membengkak tak terduga.
    chunkSizeWarningLimit: 1000,
  },
})
