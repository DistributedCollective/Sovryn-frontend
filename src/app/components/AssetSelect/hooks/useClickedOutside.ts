import { useEffect, useState } from 'react';

export function useDetectOutsideClick(ref) {
  const [outsideClicked, setOutsideClicked] = useState(false);
  useEffect(() => {
    const handleOnClickPage = event => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOutsideClicked(true);
      }
    };
    document.addEventListener('mousedown', handleOnClickPage);
    return () => {
      document.removeEventListener('mousedown', handleOnClickPage);
    };
  }, [ref]);
  return outsideClicked;
}
