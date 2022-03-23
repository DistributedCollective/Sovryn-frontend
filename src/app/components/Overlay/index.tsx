import React, {
  ReactNode,
  useMemo,
  useCallback,
  MouseEventHandler,
  MouseEvent,
  useEffect,
} from 'react';
import { Align, AlignVertical } from '../../../types/tailwind';
import classNames from 'classnames';
import { Portal } from '../Portal';

export enum OverlayBackground {
  transparent = 'transparent',
  light25 = 'light25',
  light75 = 'light75',
  dark25 = 'dark25',
  dark75 = 'dark75',
}

const OverlayBackgroundClassName: { [key in OverlayBackground]: string } = {
  [OverlayBackground.transparent]: 'tw-bg-transparent',
  [OverlayBackground.light25]: 'tw-bg-gray-9 tw-bg-opacity-25',
  [OverlayBackground.light75]: 'tw-bg-gray-9 tw-bg-opacity-75',
  [OverlayBackground.dark25]: 'tw-bg-gray-1 tw-bg-opacity-25',
  [OverlayBackground.dark75]: 'tw-bg-gray-1 tw-bg-opacity-75',
};

const AlignClassName: { [key in Align]: string } = {
  [Align.left]: 'tw-justify-start',
  [Align.center]: 'tw-justify-center',
  [Align.right]: 'tw-justify-end',
};

const AlignVerticalClassName: { [key in AlignVertical]: string } = {
  [AlignVertical.top]: 'tw-items-start',
  [AlignVertical.center]: 'tw-items-center',
  [AlignVertical.bottom]: 'tw-items-end',
};

type OverlayProps = {
  className?: string;
  portalTarget?: string;
  zIndex?: number;
  fixed?: boolean;
  isOpen?: boolean;
  align?: Align;
  alignVertical?: AlignVertical;
  background?: OverlayBackground;
  onBlur: MouseEventHandler;
  children: ReactNode;
};

export const Overlay: React.FC<OverlayProps> = ({
  className,
  portalTarget,
  zIndex,
  fixed = false,
  isOpen = true,
  align = Align.center,
  alignVertical = AlignVertical.center,
  background = OverlayBackground.dark75,
  onBlur,
  children,
}) => {
  const onBlurHandler = useCallback(
    (event: MouseEvent) => {
      if (onBlur) {
        onBlur(event);
      }
      event.preventDefault();
      event.stopPropagation();
    },
    [onBlur],
  );

  const element = useMemo(
    () =>
      isOpen ? (
        <div
          className={classNames(
            fixed ? 'tw-fixed' : 'tw-absolute',
            'tw-inset-0 tw-flex tw-flex-column',
            AlignClassName[align],
            AlignVerticalClassName[alignVertical],
            OverlayBackgroundClassName[background],
            className,
          )}
          style={!fixed && zIndex ? { zIndex } : undefined}
          onClick={onBlurHandler}
        >
          {children}
        </div>
      ) : null,
    [
      children,
      isOpen,
      fixed,
      align,
      alignVertical,
      background,
      className,
      zIndex,
      onBlurHandler,
    ],
  );

  useEffect(() => {
    if (fixed && isOpen) {
      document.body.className += ' tw-overflow-hidden';
      return () => {
        document.body.className = document.body.className.replace(
          ' tw-overflow-hidden',
          '',
        );
      };
    }
  }, [fixed, isOpen]);

  if (fixed) {
    return (
      <Portal target={portalTarget} zIndex={zIndex}>
        {element}
      </Portal>
    );
  }
  return element;
};
