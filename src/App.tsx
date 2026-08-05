import { lazy, Suspense, useState } from 'react';
import './App.css';
import LenisScroller from './components/LenisScroller.tsx';
import Loader from './components/Loader.tsx';
import Navbar from './components/Navbar.tsx';
import Hero from './components/sections/Hero.tsx';
import BrandStory from './components/sections/BrandStory.tsx';
import ProductHighlights from './components/sections/ProductHighlights.tsx';
import Specs from './components/sections/Specs.tsx';
import Nock from './components/sections/Nock.tsx';
import Gallery from './components/sections/Gallery.tsx';
import Pricing from './components/sections/Pricing.tsx';
import CTAFooter from './components/sections/CTAFooter.tsx';

// Dynamic import - Three.js/@react-three/fiber/drei (kontributor utama
// ukuran bundle) jadi chunk JS TERPISAH yang di-download & di-parse
// SETELAH kode utama React sudah jalan, bukan ikut memblokir bundle
// awal. Chunk ini tetap besar (memang berat, sifat library 3D), tapi
// sekarang tidak menghalangi apapun selain Scene itu sendiri - dan
// selama chunk ini masih diunduh, tirai (Loader) tetap menutup layar
// karena sceneReady masih false, jadi user tidak lihat apa-apa yang
// aneh, cuma tirai sedikit lebih lama sebelum kebuka.
const Scene = lazy(() => import('./components/three/Scene.tsx'));

function App() {
  // false di awal - Loader menutup layar sampai Scene (arrow + environment
  // map) benar-benar siap, baru dibuka. Jadi tidak ada lagi arrow yang
  // "pop-in" belakangan atau kelihatan flat sesaat sebelum HDR selesai.
  const [sceneReady, setSceneReady] = useState(false);

  return (
    <>
      <Loader ready={sceneReady} />
      <LenisScroller />
      <Navbar />
      <div className="content-container">
        <Hero />
        <BrandStory />
        <ProductHighlights />
        <Specs />
        <Nock />
        <Gallery />
        <Pricing />
        <CTAFooter />
      </div>
      <div className="canvas-container">
        <Suspense fallback={null}>
          <Scene onReady={() => setSceneReady(true)} />
        </Suspense>
      </div>
    </>
  )
}

export default App
