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
  dataActionId?: string;
};

export const CustomArrow: React.FC<CustomArrowProps> = ({
  arrowType,
  onClick,
  className,
  dataActionId,
}) => (
  <div className={className} onClick={onClick} data-action-id={dataActionId}>
    <Icon
      icon={arrowType === ArrowType.LEFT ? 'chevron-left' : 'chevron-right'}
      iconSize={25}
      color="white"
    />
  </div>
);
