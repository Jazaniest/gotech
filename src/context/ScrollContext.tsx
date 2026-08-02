import { createContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';

export interface ScrollContextData {
  scrollYProgress: number;
  setScrollYProgress: Dispatch<SetStateAction<number>>;
}

export const ScrollContext =
  createContext<ScrollContextData | undefined>(undefined);