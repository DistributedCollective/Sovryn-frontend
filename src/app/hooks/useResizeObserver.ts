import { useCallback, useEffect, useState } from 'react';
import { Nullable } from '../../types';

export const useResizeObserver = <E extends HTMLElement>() => {
  const [element, setElement] = useState<E>();
  const [dimensions, setDimensions] = useState<Nullable<DOMRectReadOnly>>(null);
  const ref = useCallback(ref => ref && setElement(ref), [setElement]);

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
      const updateLocation = () => {
        const rect = element.getBoundingClientRect();
        setDimensions(previous => {
          if (
            !previous ||
            rect.width !== previous.width ||
            rect.height !== previous.height
          ) {
            return rect;
          }
          return previous;
        });
      };

      updateLocation();
      const intervalId = setInterval(updateLocation, 500);

      return () => clearInterval(intervalId);
    }
  }, [element]);

  return {
    ref,
    dimensions,
  };
};
