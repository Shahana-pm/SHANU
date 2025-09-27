"use client";

import { useState, useEffect } from 'react';
import { onSnapshot, DocumentReference } from 'firebase/firestore';
import { FirestorePermissionError } from '../errors';
import { errorEmitter } from '../error-emitter';

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
            setError(null);
        }, (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: ref.path,
                operation: 'get',
            });
            errorEmitter.emit('permission-error', permissionError);
            setError(permissionError);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [ref]);

    return { data, loading, error };
}
