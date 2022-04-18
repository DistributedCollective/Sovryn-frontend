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

export enum DropdownMode {
  left = 'left',
  right = 'right',
  center = 'center',
  sameWidth = 'sameWidth',
}

export enum DropdownColor {
  gray2 = 'gray2',
  gray3 = 'gray3',
  gray4 = 'gray4',
}

type DropdownCoords = {
  top: number;
  left: number;
  width: number;
  widthContainer: number;
};

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
  const [coords, setCoords] = useState<DropdownCoords | null>(null);
  const onButtonClick = useCallback(() => setOpen(prevValue => !prevValue), [
    setOpen,
  ]);

  const getCoords = useCallback(() => {
    const button = buttonRef.current?.getBoundingClientRect();
    const dropdown = dropdownRef.current?.getBoundingClientRect();
    const scrollOffset = window.scrollY;

    if (button && dropdown) {
      const { width: widthContainer } = dropdown;
      const { top, left, width, height } = button;
      return {
        top: top + height + scrollOffset,
        left: left,
        width: width,
        widthContainer: widthContainer,
      };
    }
    return null;
  }, []);

  const dropdownStyles = useMemo(() => {
    if (!coords) return;

    const { top, left, width, widthContainer } = coords;
    const DropdownPosition = {
      left: {
        left: `${left}px`,
      },
      right: {
        left: `${left + width}px`,
        transform: 'translateX(-100%)',
      },
      center: {
        left: `${left - (widthContainer - width) / 2}px`,
      },
      sameWidth: {
        left: `${left}px`,
        width: `${width}px`,
        overflowX: 'auto',
      },
    };

    const DropdownPositionTop = {
      top: `${top}px`,
    };

    const DropdownPositionStyles = {
      ...DropdownPosition[mode],
      ...DropdownPositionTop,
    };

    return DropdownPositionStyles;
  }, [coords, mode]);

  const classNameComplete = useMemo(
    () =>
      classNames(
        styles.button,
        isOpen && styles.isOpen,
        color && styles[color],
        className,
      ),
    [color, className, isOpen],
  );

  const useClickedOutside = useCallback(() => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  useOnClickOutside([buttonRef, dropdownRef], useClickedOutside);

  useEffect(() => {
    if (!isOpen) return;
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
            'tw-transform tw-rotate-180': isOpen,
          })}
        ></span>
      </button>

      {isOpen && (
        <Portal target="body">
          <div
            className={classNames(
              styles.dropdown,
              dropdownClassName,
              color && styles[color],
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
