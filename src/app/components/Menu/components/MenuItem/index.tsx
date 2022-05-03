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
import iconNewTab from 'assets/images/iconNewTab.svg';

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
  dataActionId?: string;
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
  dataActionId,
}) => {
  const onClickWhenAllowed = useCallback(
    (event: MouseEvent) => {
      if (disabled) {
        event.preventDefault();
        event.stopPropagation();
      } else if (onClick) {
        onClick(event);
      }
    },
    [onClick, disabled],
  );

  const button = useMemo(() => {
    if (href) {
      if (hrefExternal) {
        return (
          <a
            className={classNames(styles.button, disabled && styles.disabled)}
            href={href}
            target="_blank"
            rel="noreferrer"
            onClick={onClickWhenAllowed}
            data-action-id={dataActionId}
          >
            {icon && <FontAwesomeIcon icon={icon} className="tw-mr-2" />}
            {text}
            <img
              src={iconNewTab}
              className="tw-ml-2 tw-h-5"
              alt="external link"
            />
            {label && <span className={styles.label}>{label}</span>}
          </a>
        );
      } else {
        return (
          <Link
            to={href}
            className={classNames(styles.button, disabled && styles.disabled)}
            onClick={onClickWhenAllowed}
            data-action-id={dataActionId}
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
          className={classNames(styles.button, disabled && styles.disabled)}
          onClick={onClickWhenAllowed}
          data-action-id={dataActionId}
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
    onClickWhenAllowed,
    icon,
    text,
    label,
    dataActionId,
  ]);

  return <li className={classNames(styles.host, className)}>{button}</li>;
};
