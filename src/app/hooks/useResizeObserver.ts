import { useCallback, useEffect, useState } from 'react';

export const useResizeObserver = <E extends HTMLElement>() => {
  const [element, setElement] = useState<E>();
  const [dimensions, setDimensions] = useState<DOMRectReadOnly | null>(null);
  const ref = useCallback(ref => setElement(ref), [setElement]);

  useEffect(() => {
    if (!element) {
      return;
    }

    if (typeof window.ResizeObserver !== 'undefined') {
      const observer = new window.ResizeObserver(entries => {
        setDimensions(entries[0]?.contentRect);
      });
      observer.observe(element);
      return () => observer.disconnect();
    } else {
      const intervalId = setInterval(() => {
        const rect = element.getBoundingClientRect();
        console.log('interval', rect);
        setDimensions(previous => {
          if (
            previous &&
            (rect.width !== previous.width || rect.height !== previous.height)
          ) {
            return rect;
          }
          return previous;
        });
      }, 500);

      return () => clearInterval(intervalId);
    }
  }, [element]);

  return {
    ref,
    dimensions,
  };
};
