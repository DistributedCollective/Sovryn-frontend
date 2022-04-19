import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Portal } from '../Portal';
import styles from './index.module.scss';
import { useOnClickOutside } from 'app/hooks/useOnClickOutside';
import { Nullable } from 'types';
import { DropdownColor, DropdownCoords, DropdownMode } from './types';
import { getDropdownPositionStyles } from './utils';

interface IDropdownProps {
  text: ReactNode;
  children: ReactNode;
  mode?: DropdownMode;
  color?: DropdownColor;
  onOpen?: () => void;
  onClose?: () => void;
  className?: string;
  dataActionId?: string;
  dropdownClassName?: string;
}

export const Dropdown: React.FC<IDropdownProps> = ({
  text,
  children,
  mode = DropdownMode.sameWidth,
  color = DropdownColor.gray3,
  onOpen,
  onClose,
  className,
  dataActionId,
  dropdownClassName,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useState(false);
  const [coords, setCoords] = useState<Nullable<DropdownCoords>>(null);
  const onButtonClick = useCallback(() => setOpen(prevValue => !prevValue), [
    setOpen,
  ]);

  const getCoords = useCallback(() => {
    const button = buttonRef.current?.getBoundingClientRect();
    const dropdownWidth = dropdownRef.current?.getBoundingClientRect().width;
    const windowWidth = document.body.getBoundingClientRect().width;
    const scrollOffset = window.scrollY;
    if (button && dropdownWidth) {
      const { top, left, right, width, height } = button;
      return {
        top: top + height + scrollOffset,
        left: left,
        right: right,
        buttonWidth: width,
        windowWidth: windowWidth,
        dropdownWidth: dropdownWidth,
      };
    }
    return null;
  }, []);

  const dropdownStyles = useMemo(() => {
    if (!coords) {
      return;
    }
    return getDropdownPositionStyles(coords, mode);
  }, [coords, mode]);

  const classNameComplete = useMemo(
    () => classNames(styles.button, color, className),
    [color, className],
  );

  const useClickedOutside = useCallback(() => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  useOnClickOutside([buttonRef, dropdownRef], useClickedOutside);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const coords = getCoords();
    setCoords(coords);

    if (onOpen) {
      onOpen();
    }
  }, [isOpen, getCoords, onOpen, mode]);

  return (
    <>
      <button
        className={classNames(classNameComplete)}
        data-action-id={dataActionId}
        onClick={onButtonClick}
        type="button"
        ref={buttonRef}
      >
        {text}
        <span
          className={classNames(styles.iconArrow, {
            'tw-transform tw-rotate-180 tw-rounded-b-none': isOpen,
          })}
        ></span>
      </button>

      {isOpen && (
        <Portal target="body">
          <div
            className={classNames(
              'tw-absolute tw-overflow-x-auto tw-rounded-b-lg tw-min-h-8 tw-py-2 tw-px-4',
              dropdownClassName,
              color,
            )}
            style={dropdownStyles}
            ref={dropdownRef}
          >
            {children}
          </div>
        </Portal>
      )}
    </>
  );
};
