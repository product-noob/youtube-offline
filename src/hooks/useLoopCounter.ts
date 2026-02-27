import { useRef, useCallback } from 'react';
import { DEFAULT_LOOP_COUNT } from '../utils/constants';

interface UseLoopCounterResult {
  handleEnded: () => 'replay' | 'advance';
  reset: () => void;
}

export function useLoopCounter(maxLoops: number = DEFAULT_LOOP_COUNT): UseLoopCounterResult {
  const countRef = useRef(0);

  const handleEnded = useCallback((): 'replay' | 'advance' => {
    countRef.current += 1;
    if (countRef.current >= maxLoops) {
      return 'advance';
    }
    return 'replay';
  }, [maxLoops]);

  const reset = useCallback(() => {
    countRef.current = 0;
  }, []);

  return { handleEnded, reset };
}
