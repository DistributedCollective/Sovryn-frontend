import React, {
  ReactNode,
  MouseEventHandler,
  MouseEvent,
  useMemo,
  useCallback,
} from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './index.module.scss';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type MenuItemProps = {
  className?: string;
  //TODO: use IconComponents enum here instead, requires Icon Component to be done
  icon?: IconProp;
  text: ReactNode;
  label?: ReactNode;
  disabled?: boolean;
  href?: string;
  hrefExternal?: boolean;
  onClick?: MouseEventHandler;
};

export const MenuItem: React.FC<MenuItemProps> = ({
  className,
  icon,
  text,
  label,
  disabled,
  href,
  hrefExternal,
  onClick,
}) => {
  const onClickWhenAllowed = useCallback(
    (event: MouseEvent) => {
      if (onClick && !disabled) {
        onClick(event);
      }
    },
    [onClick, disabled],
  );

  const classNameComplete = useMemo(
    () =>
      classNames(
        'tw-flex tw-items-center tw-w-full tw-px-4 tw-py-2 tw-text-sov-white tw-text-left tw-no-underline',
        disabled ? 'tw-opacity-50 tw-cursor-not-allowed' : 'hover:tw-bg-gray-4',
        className,
      ),
    [disabled, className],
  );

  const item = useMemo(() => {
    if (href) {
      if (hrefExternal) {
        return (
          <a
            className={classNameComplete}
            href={href}
            target="_blank"
            rel="noreferrer"
            onClick={onClickWhenAllowed}
          >
            {icon && <FontAwesomeIcon icon={icon} className="tw-mr-2" />}
            {text}
            {label && <span className={styles.label}>{label}</span>}
          </a>
        );
      } else {
        return (
          <Link
            to={href}
            className={classNameComplete}
            onClick={onClickWhenAllowed}
          >
            {icon && <FontAwesomeIcon icon={icon} className="tw-mr-2" />}
            {text}
            {label && <span className={styles.label}>{label}</span>}
          </Link>
        );
      }
    } else {
      return (
        <button
          type="button"
          disabled={disabled}
          className={classNameComplete}
          onClick={onClickWhenAllowed}
        >
          {icon && <FontAwesomeIcon icon={icon} className="tw-mr-2" />}
          {text}
          {label && <span className={styles.label}>{label}</span>}
        </button>
      );
    }
  }, [
    disabled,
    href,
    hrefExternal,
    classNameComplete,
    onClickWhenAllowed,
    icon,
    text,
    label,
  ]);

  return <li className={classNames('tw-relative', className)}>{item}</li>;
};
