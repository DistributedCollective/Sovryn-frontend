import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

// This hook will perform the effect only if the state hasn't been updated for the duration of the delay
// set runOnMount (4th) parameter to false if hook should skip first running and run only
//   when props are changed for second time.
export function useDebouncedEffect(
  effect: EffectCallback,
  deps: DependencyList,
  delay: number,
  runOnMount: boolean = true,
) {
  const data = useRef<{ firstTime: boolean; clearFunc?: void | unknown }>({
    firstTime: !runOnMount,
  });
  useEffect(() => {
    const { firstTime, clearFunc } = data.current;

    if (firstTime) {
      data.current.firstTime = false;
      return;
    }

    const handler = setTimeout(() => {
      if (clearFunc && typeof clearFunc === 'function') {
        clearFunc();
      }
      data.current.clearFunc = effect();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
    // we dont need effect to be as dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(deps || []), delay]);
}
