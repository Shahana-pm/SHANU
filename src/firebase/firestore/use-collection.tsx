"use client";

import { useState, useEffect } from 'react';
import { onSnapshot, Query, CollectionReference } from 'firebase/firestore';
import { FirestorePermissionError } from '../errors';
import { errorEmitter } from '../error-emitter';

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
            setError(null);
        }, (serverError) => {
            const path = 'path' in q ? q.path : 'unknown path';
            const permissionError = new FirestorePermissionError({
                path,
                operation: 'list',
            });
            errorEmitter.emit('permission-error', permissionError);
            setError(permissionError);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [q]);

    return { data, loading, error };
}
