'use client';

import { useState, useCallback } from 'react';

interface ErrorState {
  error: string | null;
  isError: boolean;
}

export function useErrorHandler() {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isError: false,
  });

  const setError = useCallback((error: string | Error) => {
    const errorMessage = error instanceof Error ? error.message : error;
    setErrorState({
      error: errorMessage,
      isError: true,
    });
  }, []);

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      isError: false,
    });
  }, []);

  const handleAsync = useCallback(async (fn: () => Promise<void>) => {
    try {
      clearError();
      await fn();
    } catch (error) {
      setError(error instanceof Error ? error : new Error(String(error)));
    }
  }, [setError, clearError]);

  return {
    error: errorState.error,
    isError: errorState.isError,
    setError,
    clearError,
    handleAsync,
  };
}