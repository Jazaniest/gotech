# Task 1: Project Scaffolding & Setup

**Files:**
- Create: `src/components/sections/`
- Create: `src/components/three/`
- Create: `src/context/`
- Create: `src/animations/`
- Create: `src/styles/`
- Create: `src/components/LenisScroller.tsx`
- Create: `src/context/ScrollContext.tsx`
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`
- Modify: `src/index.css`

**Interfaces:**
- Produces: A basic application structure with all necessary folders, a smooth scroller, and a global context for animation state.

- [ ] **Step 1: Create directory structure**
  ```powershell
  New-Item -ItemType Directory -Force -Path src/components/sections, src/components/three, src/context, src/animations, src/styles
  ```

- [ ] **Step 2: Create initial `ScrollContext.tsx`**
  ```tsx
  // src/context/ScrollContext.tsx
  import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

  interface ScrollContextData {
    scrollYProgress: number;
    setScrollYProgress: Dispatch<SetStateAction<number>>;
  }

  const ScrollContext = createContext<ScrollContextData | undefined>(undefined);

  export const ScrollProvider = ({ children }: { children: ReactNode }) => {
    const [scrollYProgress, setScrollYProgress] = useState(0);

    const value = { scrollYProgress, setScrollYProgress };

    return (
      <ScrollContext.Provider value={value}>
        {children}
      </ScrollContext.Provider>
    );
  };

  export const useScroll = () => {
    const context = useContext(ScrollContext);
    if (context === undefined) {
      throw new Error('useScroll must be used within a ScrollProvider');
    }
    return context;
  };
  ```

- [ ] **Step 3: Create `LenisScroller.tsx`**
  ```tsx
  // src/components/LenisScroller.tsx
  import { useEffect } from 'react';
  import Lenis from 'lenis';
  import gsap from 'gsap';
  import ScrollTrigger from 'gsap/ScrollTrigger';
  
  gsap.registerPlugin(ScrollTrigger);

  const LenisScroller = () => {
    useEffect(() => {
      const lenis = new Lenis();

      lenis.on('scroll', ScrollTrigger.update);
      
      const update = (time: number) => {
        lenis.raf(time * 1000);
      }

      gsap.ticker.add(update);
      gsap.ticker.lagSmoothing(0);

      return () => {
        gsap.ticker.remove(update);
        lenis.destroy();
      };
    }, []);

    return null;
  };

  export default LenisScroller;
  ```

- [ ] **Step 4: Update `main.tsx` to wrap App with provider**
  ```tsx
  // src/main.tsx
  import React from 'react'
  import ReactDOM from 'react-dom/client'
  import App from './App.tsx'
  import './index.css'
  import { ScrollProvider } from './context/ScrollContext.tsx';

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ScrollProvider>
        <App />
      </ScrollProvider>
    </React.StrictMode>,
  )
  ```
  
- [ ] **Step 5: Setup global styles in `index.css`**
  ```css
  /* src/index.css */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Space+Grotesk:wght@700&display=swap');

  :root {
    --color-background: #121212;
    --color-text: #E0E0E0;
    --color-accent: #00BFFF; /* Electric Blue */
    --font-primary: 'Inter', sans-serif;
    --font-display: 'Space Grotesk', sans-serif;
  }

  body {
    margin: 0;
    font-family: var(--font-primary);
    background-color: var(--color-background);
    color: var(--color-text);
  }
  ```
  
- [ ] **Step 6: Update `App.tsx` layout**
    ```tsx
    // src/App.tsx
    import './App.css';
    import LenisScroller from './components/LenisScroller.tsx';

    function App() {
      return (
        <>
          <LenisScroller />
          <div className="content-container" style={{ height: '200vh', padding: '2rem' }}>
            <h1>Gotech Landing Page</h1>
            <p>Scroll down...</p>
          </div>
          <div className="canvas-container">
            {/* Scene will go here */}
          </div>
        </>
      )
    }

    export default App
    ```
    
- [ ] **Step 7: Add styles for layout in `App.css`**
    ```css
    /* src/App.css */
    .content-container {
      position: relative;
      z-index: 1;
    }

    .canvas-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 0;
    }
    ```
