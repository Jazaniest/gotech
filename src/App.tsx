import { lazy, Suspense, useState } from 'react';
import './App.css';
import LenisScroller from '@/components/LenisScroller.tsx';
import Loader from '@/components/Loader.tsx';
import Navbar from '@/components/Navbar.tsx';
import Hero from '@/components/sections/Hero.tsx';
import BrandStory from '@/components/sections/BrandStory.tsx';
import ProductHighlights from '@/components/sections/ProductHighlights.tsx';
import Specs from '@/components/sections/Specs.tsx';
import Nock from '@/components/sections/Nock.tsx';
import Gallery from '@/components/sections/Gallery.tsx';
import Pricing from '@/components/sections/Pricing.tsx';
import CTAFooter from '@/components/sections/CTAFooter.tsx';

const Scene = lazy(() => import('@/components/three/Scene.tsx'));

function App() {
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
