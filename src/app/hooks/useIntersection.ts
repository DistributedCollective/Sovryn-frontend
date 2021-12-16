import { useState, useEffect } from 'react';

export const useIntersection = (
  element: Element | null,
  threshold: string = '0px',
) => {
  const [isVisible, setState] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(entry.isIntersecting);
      },
      { rootMargin: threshold },
    );

    element && element !== null && observer.observe(element);

    return () => {
      element && element !== null && observer.unobserve(element);
    };
  }, [element, threshold]);

  return isVisible;
};
