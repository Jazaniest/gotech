import { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

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