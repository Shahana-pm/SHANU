'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      console.error(error); // Log the full error for debugging
      
      // Throw the error in development to show the Next.js error overlay
      if (process.env.NODE_ENV === 'development') {
        throw error;
      } else {
        // In production, just show a generic toast
        toast({
            variant: "destructive",
            title: "Permission Denied",
            description: "You do not have permission to perform this action.",
        });
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null; // This component doesn't render anything
}
