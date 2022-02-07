import React, { ReactNode } from 'react';
import { TradingPosition } from 'types/trading-position';
import { DirectionLabel } from '../OpenPositionsTable/styled';

type PositionBlockProps = {
  position: TradingPosition;
  name: ReactNode;
};

export const PositionBlock: React.FC<PositionBlockProps> = ({
  position,
  name,
}) => {
  return (
    <div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-whitespace-nowrap">
      <DirectionLabel position={position}>{name}</DirectionLabel>
    </div>
  );
};
