"use client";

import { useState, useEffect } from 'react';
import { onSnapshot, DocumentReference } from 'firebase/firestore';

interface FetchHook<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

export function useDoc<T>(ref: DocumentReference | null): FetchHook<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!ref) {
            setLoading(false);
            return;
        };
        setLoading(true);
        const unsubscribe = onSnapshot(ref, (doc) => {
            if (doc.exists()) {
                setData({ id: doc.id, ...doc.data() } as T);
            } else {
                setData(null);
            }
            setLoading(false);
        }, (err) => {
            setError(err);
            setLoading(false);
            console.error(err);
        });

        return () => unsubscribe();
    }, [ref]);

    return { data, loading, error };
}
