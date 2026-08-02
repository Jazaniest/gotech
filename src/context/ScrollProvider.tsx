import { useState } from 'react';
import type { ReactNode } from 'react';
import { ScrollContext } from './ScrollContext';

export function ScrollProvider({ children }: { children: ReactNode }) {
    const [scrollYProgress, setScrollYProgress] = useState(0);

    return (
        <ScrollContext.Provider
            value={{ scrollYProgress, setScrollYProgress }}
        >
            {children}
        </ScrollContext.Provider>
    );
}