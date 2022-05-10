import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core';
import classNames from 'classnames';
import styles from './index.module.scss';
import { IconSvgPaths } from './iconSvgPaths';
import { IconType, ViewBoxSize } from './types';

const STANDARD = 16;
const INLINE = '1em';
const SM = 'sm';

type IconProps = {
  /**
   * Name of a Sovryn UI icon, or an custom SVG element, or an Fontawesome imported icon to render.
   * This prop is required because it determines the content of the component
   */
  icon: IconType;
  /**
   * Size of the icon, in pixels or in scale (1x, 2x, 3x ...) for the Fontawesome icons.
   * @default STANDARD = 16
   */
  size?: number | SizeProp;
  /**
   * Inline sets size to 1em.
   */
  inline?: boolean;
  /**
   * Applied classNames to the outer element.
   */
  className?: string;
};

export const Icon: React.FC<IconProps> = ({
  icon,
  size = STANDARD,
  inline,
  className,
}) => {
  const isFaIcon = useMemo(() => {
    if (icon && icon['prefix']) {
      return true;
    }
    return false;
  }, [icon]);

  const iconFaSize = useMemo(() => {
    if (inline) {
      return SM;
    } else {
      return size as SizeProp;
    }
  }, [inline, size]);

  const inlineBlock = useMemo(() => {
    return inline ? 'tw-inline-block' : 'tw-block';
  }, [inline]);

  const renderIcon = useMemo(() => {
    const iconSize = inline ? INLINE : size;
    //checking if we trying to show a custom icon
    if (typeof icon !== 'string') {
      return (
        <div
          className={classNames(className, styles.customIcon, inlineBlock)}
          style={{ width: iconSize, height: iconSize }}
        >
          {icon}
        </div>
      );
    }

    //getting the svg path(s) for the icon
    const paths = IconSvgPaths[icon].map((path: string, i: number) => (
      <path key={i} d={path} clipRule="evenodd" fillRule="evenodd" />
    ));
    return (
      <svg
        viewBox={ViewBoxSize.DEFAULT}
        height={iconSize}
        width={iconSize}
        fill="currentColor"
        className={classNames(className, inlineBlock)}
      >
        {paths}
      </svg>
    );
  }, [icon, inline, size, inlineBlock, className]);

  return (
    <>
      {isFaIcon ? (
        <FontAwesomeIcon
          className={classNames(className, inlineBlock)}
          size={iconFaSize}
          icon={icon as IconProp}
        />
      ) : (
        renderIcon
      )}
    </>
  );
};
