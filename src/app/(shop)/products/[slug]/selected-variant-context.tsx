
'use client';
import { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

export interface SelectedVariantContextType {
    selectedVariantId: string | null;
    setSelectedVariantId: Dispatch<SetStateAction<string | null>>;
}

export const SelectedVariantContext = createContext<SelectedVariantContextType | undefined>(undefined);

export function SelectedVariantProvider({ children }: { children: ReactNode }) {
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

    return (
        <SelectedVariantContext.Provider value={{ selectedVariantId, setSelectedVariantId }}>
            {children}
        </SelectedVariantContext.Provider>
    );
}
