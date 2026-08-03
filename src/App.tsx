import { useState } from 'react';
import './App.css';
import LenisScroller from './components/LenisScroller.tsx';
import Loader from './components/Loader.tsx';
import Scene from './components/three/Scene.tsx';
import Hero from './components/sections/Hero.tsx';
import BrandStory from './components/sections/BrandStory.tsx';
import ProductHighlights from './components/sections/ProductHighlights.tsx';
import Specs from './components/sections/Specs.tsx';
import Gallery from './components/sections/Gallery.tsx';
import Pricing from './components/sections/Pricing.tsx';
import CTAFooter from './components/sections/CTAFooter.tsx';

function App() {
  // false di awal - Loader menutup layar sampai Scene (arrow + environment
  // map) benar-benar siap, baru dibuka. Jadi tidak ada lagi arrow yang
  // "pop-in" belakangan atau kelihatan flat sesaat sebelum HDR selesai.
  const [sceneReady, setSceneReady] = useState(false);

  return (
    <>
      <Loader ready={sceneReady} />
      <LenisScroller />
      <div className="content-container">
        <Hero />
        <BrandStory />
        <ProductHighlights />
        <Specs />
        <Gallery />
        <Pricing />
        <CTAFooter />
      </div>
      <div className="canvas-container">
        <Scene onReady={() => setSceneReady(true)} />
      </div>
    </>
  )
}

export default App
