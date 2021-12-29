import { useState, useEffect } from 'react';

export const useIntersection = (
  element: Element | null,
  threshold: string = '0px',
) => {
  const [isVisible, setState] = useState(false);

  useEffect(() => {
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(entry.isIntersecting);
      },
      { rootMargin: threshold },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [element, threshold]);

  return isVisible;
};
