import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core';
import styles from './index.module.scss';
import { IconSvgPaths } from './iconSvgPaths';
import { IconType, IconSize, ViewBoxSize } from './types';

type IconProps = {
  /**
   * Name of a Sovryn UI icon, or an custom SVG element, or an Fontawesome imported icon to render.
   * This prop is required because it determines the content of the component
   */
  icon: IconType;
  /**
   * Size of the icon, in pixels or in scale (1x, 2x, 3x ...) for the Fontawesome icons.
   * @default IconSize.STANDARD = 16
   */
  size?: number | string;
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
  size = IconSize.STANDARD,
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
      return IconSize.SM;
    } else {
      return size as SizeProp;
    }
  }, [inline, size]);

  const renderIcon = useMemo(() => {
    const iconSize = inline ? IconSize.INLINE : size;
    //checking if we trying to show a custom icon
    if (typeof icon !== 'string') {
      return (
        <div
          className={styles.customIcon}
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
      <>
        <svg
          viewBox={ViewBoxSize.DEFAULT}
          height={iconSize}
          width={iconSize}
          fill="currentColor"
        >
          {paths}
        </svg>
      </>
    );
  }, [icon, inline, size]);

  return (
    <div className={className}>
      {isFaIcon ? (
        <FontAwesomeIcon size={iconFaSize} icon={icon as IconProp} />
      ) : (
        renderIcon
      )}
    </div>
  );
};
