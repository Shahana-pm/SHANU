
'use client';
import { useMemo, type DependencyList } from 'react';

/**
 * A custom hook that memoizes a Firestore query or document reference.
 * This is crucial to prevent infinite loops in `useEffect` hooks within
 * `useCollection` or `useDoc` when the reference is created dynamically.
 * 
 * It stringifies the dependencies to ensure that the query is only
 * re-created when the actual values of the dependencies change, not
 * just the object references.
 */
export function useMemoFirebase<T>(factory: () => T, deps: DependencyList | undefined): T {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useMemo(factory, deps?.map(dep => {
        if (typeof dep === 'object' && dep !== null) {
            try {
                return JSON.stringify(dep);
            } catch {
                return dep;
            }
        }
        return dep;
    }));
}
