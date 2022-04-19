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
  right: number;
  buttonWidth: number;
  windowWidth: number;
  widthDropdown: number;
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
    const widthDropdown = dropdownRef.current?.getBoundingClientRect().width;
    const windowWidth = document.body.getBoundingClientRect().width;
    const scrollOffset = window.scrollY;
    if (button && widthDropdown) {
      const { top, left, right, width, height } = button;
      return {
        top: top + height + scrollOffset,
        left: left,
        right: right,
        buttonWidth: width,
        windowWidth: windowWidth,
        widthDropdown: widthDropdown,
      };
    }
    return null;
  }, []);

  const dropdownStyles = useMemo(() => {
    if (!coords) return;
    const {
      top,
      left,
      right,
      buttonWidth,
      windowWidth,
      widthDropdown,
    } = coords;

    //getting the max width for the dropdown according to the button width
    // and to prevent it from going out of the screen
    const rightButtonOffset = windowWidth - (left + buttonWidth);
    let maxCenterWidthDropdown: number;

    if (rightButtonOffset > left) {
      maxCenterWidthDropdown = left * 2 + buttonWidth;
    } else if (rightButtonOffset < left) {
      maxCenterWidthDropdown = right * 2 + buttonWidth;
    } else {
      maxCenterWidthDropdown = windowWidth;
    }

    const centerWidthDropdown =
      widthDropdown > maxCenterWidthDropdown
        ? maxCenterWidthDropdown
        : widthDropdown;

    const DropdownPosition = {
      left: {
        left: `${left}px`,
        maxWidth: `${windowWidth - left}px`,
      },
      right: {
        left: `${left + buttonWidth}px`,
        maxWidth: `${left + buttonWidth}px`,
        transform: 'translateX(-100%)',
      },
      center: {
        left: `${left - (centerWidthDropdown - buttonWidth) / 2}px`,
        maxWidth: `${maxCenterWidthDropdown}px`,
      },
      sameWidth: {
        left: `${left}px`,
        width: `${buttonWidth}px`,
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
