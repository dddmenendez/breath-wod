// CANONICAL TEMPLATE — copy and adapt.
// Do NOT import this file. Use it as a reference when creating custom hooks.
//
// Pattern: Custom hook that encapsulates a piece of reusable logic.
// Prefer hooks for logic shared across components within a feature.
// If logic is shared across features, put the hook in src/shared/hooks/.

import { useEffect, useState } from 'react';

interface UseExampleTickerOptions {
  intervalMs?: number;
  enabled?: boolean;
}

interface UseExampleTickerReturn {
  now: number;
  tick: () => void;
}

/**
 * Returns the current timestamp, updated every `intervalMs` milliseconds.
 * Used as a lightweight re-render trigger for time-based UIs like timers.
 */
export function useExampleTicker(
  options: UseExampleTickerOptions = {}
): UseExampleTickerReturn {
  const { intervalMs = 1000, enabled = true } = options;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!enabled) return;

    const id = window.setInterval(() => {
      setNow(Date.now());
    }, intervalMs);

    return () => {
      window.clearInterval(id);
    };
  }, [intervalMs, enabled]);

  const tick = () => setNow(Date.now());

  return { now, tick };
}
