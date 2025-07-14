import { useState, useEffect } from 'react';

interface AnonymousLimits {
  copyCount: number;
  lastReset: string;
}

const DAILY_COPY_LIMIT = 3;
const STORAGE_KEY = 'anonymous_limits';

export function useAnonymousLimits() {
  const [limits, setLimits] = useState<AnonymousLimits>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      copyCount: 0,
      lastReset: new Date().toDateString(),
    };
  });

  // Reset daily at midnight
  useEffect(() => {
    const today = new Date().toDateString();
    if (limits.lastReset !== today) {
      const resetLimits = {
        copyCount: 0,
        lastReset: today,
      };
      setLimits(resetLimits);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resetLimits));
    }
  }, [limits.lastReset]);

  const incrementCopyCount = () => {
    const newLimits = {
      ...limits,
      copyCount: limits.copyCount + 1,
    };
    setLimits(newLimits);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLimits));
  };

  const canCopy = limits.copyCount < DAILY_COPY_LIMIT;
  const remainingCopies = Math.max(0, DAILY_COPY_LIMIT - limits.copyCount);

  return {
    canCopy,
    remainingCopies,
    copyCount: limits.copyCount,
    dailyLimit: DAILY_COPY_LIMIT,
    incrementCopyCount,
  };
}