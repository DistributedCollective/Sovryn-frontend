import { RefObject, useEffect } from 'react';

type ClickOutsideHandler = MouseEvent | TouchEvent;
/**
 * This hook will detect click outside of the target(s) elements.
 * @param ignoreClicksInsideRefs RefObjects to the target(s) elements.
 * @param callback Callback function to be called when the click is outside of the target elements.
 */
export function useOnClickOutside(
  ignoreClicksInsideRefs: ReadonlyArray<RefObject<HTMLElement>>,
  callback: (event: ClickOutsideHandler) => void,
) {
  useEffect(() => {
    const handleClick = (event: ClickOutsideHandler) => {
      const { target } = event;
      if (target && target instanceof HTMLElement) {
        const shouldIgnoreByRef = ignoreClicksInsideRefs.some(ref =>
          ref.current?.contains(target),
        );

        !shouldIgnoreByRef && callback(event);
      }
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [ignoreClicksInsideRefs, callback]);
}
