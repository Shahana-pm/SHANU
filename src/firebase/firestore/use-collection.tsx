"use client";

import { useState, useEffect } from 'react';
import { onSnapshot, query, collection, where, getDocs, Query, CollectionReference, DocumentData } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

interface FetchHook<T> {
    data: T[] | null;
    loading: boolean;
    error: Error | null;
}

export function useCollection<T>(q: Query | CollectionReference | null): FetchHook<T> {
    const [data, setData] = useState<T[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!q) {
            setLoading(false);
            return;
        };
        setLoading(true);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
            setData(data);
            setLoading(false);
        }, (err) => {
            setError(err);
            setLoading(false);
            console.error(err);
        });

        return () => unsubscribe();
    }, [q]);

    return { data, loading, error };
}
