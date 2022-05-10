import React, { ReactNode, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';

type PortalProps = {
  zIndex?: number;
  className?: string;
  /** css selector string of the target element */
  target?: string;
  children: ReactNode;
};

export const Portal: React.FC<PortalProps> = ({
  zIndex,
  className,
  target = '#overlay',
  children,
}) => {
  const parent = useMemo(() => document.querySelector(target), [target]);

  const element = useMemo(() => document.createElement('div'), []);

  useEffect(() => {
    if (zIndex) {
      element.style.zIndex = zIndex.toString();
    }
  }, [zIndex, element]);

  useEffect(() => {
    if (className) {
      element.className = className;
    }
  }, [className, element]);

  useEffect(() => {
    if (parent) {
      parent.appendChild(element);
      return () => {
        parent.removeChild(element);
      };
    }
  }, [parent, element]);

  return ReactDOM.createPortal(children, element);
};
