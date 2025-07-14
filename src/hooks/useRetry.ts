import { useState, useCallback } from 'react';

interface UseRetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
}

export function useRetry(options: UseRetryOptions = {}) {
  const { maxRetries = 3, baseDelay = 1000, maxDelay = 10000 } = options;
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const executeWithRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    onError?: (error: Error, attempt: number) => void
  ): Promise<T> => {
    const attempt = async (attemptNumber: number): Promise<T> => {
      try {
        setIsRetrying(attemptNumber > 1);
        const result = await operation();
        setRetryCount(0);
        setIsRetrying(false);
        return result;
      } catch (error) {
        const err = error as Error;
        onError?.(err, attemptNumber);

        if (attemptNumber >= maxRetries) {
          setIsRetrying(false);
          throw err;
        }

        // Exponential backoff with jitter
        const delay = Math.min(
          baseDelay * Math.pow(2, attemptNumber - 1) + Math.random() * 1000,
          maxDelay
        );

        setRetryCount(attemptNumber);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return attempt(attemptNumber + 1);
      }
    };

    return attempt(1);
  }, [maxRetries, baseDelay, maxDelay]);

  const reset = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  return {
    executeWithRetry,
    retryCount,
    isRetrying,
    reset
  };
}

// Enhanced fetch with retry logic
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryOptions: UseRetryOptions = {}
) {
  const { maxRetries = 3, baseDelay = 1000 } = retryOptions;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        // Don't retry on 4xx errors (client errors)
        if (response.status >= 400 && response.status < 500) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Retry on 5xx errors (server errors) and network issues
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      const isNetworkError = error instanceof TypeError;
      const isServerError = error instanceof Error && 
        error.message.includes('HTTP 5');

      // Only retry on network errors or 5xx server errors
      if (!isLastAttempt && (isNetworkError || isServerError)) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      throw error;
    }
  }
}

// Network status hook
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useState(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  });

  return isOnline;
}