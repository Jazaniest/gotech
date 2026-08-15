import { useEffect, useState } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

const MOBILE_MAX_WIDTH = 768;
const TABLET_MAX_WIDTH = 1024;

const getBreakpoint = (): Breakpoint => {
  if (typeof window === 'undefined') return 'desktop';
  if (window.innerWidth <= MOBILE_MAX_WIDTH) return 'mobile';
  if (window.innerWidth <= TABLET_MAX_WIDTH) return 'tablet';
  return 'desktop';
};

export const useBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(getBreakpoint);

  useEffect(() => {
    const mobileMql = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
    const tabletMql = window.matchMedia(`(max-width: ${TABLET_MAX_WIDTH}px)`);
    const handleChange = () => setBreakpoint(getBreakpoint());
    mobileMql.addEventListener('change', handleChange);
    tabletMql.addEventListener('change', handleChange);
    return () => {
      mobileMql.removeEventListener('change', handleChange);
      tabletMql.removeEventListener('change', handleChange);
    };
  }, []);

  return breakpoint;
};
