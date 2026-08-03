import './App.css';
import LenisScroller from './components/LenisScroller.tsx';
import Scene from './components/three/Scene.tsx';
import Hero from './components/sections/Hero.tsx';
import BrandStory from './components/sections/BrandStory.tsx';
import ProductHighlights from './components/sections/ProductHighlights.tsx';
import Specs from './components/sections/Specs.tsx';
import Gallery from './components/sections/Gallery.tsx';
import Pricing from './components/sections/Pricing.tsx';
import CTAFooter from './components/sections/CTAFooter.tsx';

function App() {
  return (
    <>
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
        <Scene />
      </div>
    </>
  )
}

export default App