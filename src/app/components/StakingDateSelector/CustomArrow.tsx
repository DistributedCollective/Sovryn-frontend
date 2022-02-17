import React from 'react';
import { Icon } from '@blueprintjs/core';

export enum ArrowType {
  LEFT = 'left',
  RIGHT = 'right',
}

type CustomArrowProps = {
  arrowType: ArrowType;
  onClick: () => void;
  className?: string;
};

export const CustomArrow: React.FC<CustomArrowProps> = ({
  arrowType,
  onClick,
  className,
}) => (
  <div className={className} onClick={onClick}>
    <Icon
      icon={arrowType === ArrowType.LEFT ? 'chevron-left' : 'chevron-right'}
      iconSize={25}
      color="white"
    />
  </div>
);
