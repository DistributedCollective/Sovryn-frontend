import React, { ReactNode } from 'react';
import { TradingPosition } from 'types/trading-position';
import { DirectionLabel } from './styled';

export function PositionBlock({
  position,
  name,
}: {
  position: TradingPosition;
  name: ReactNode;
}) {
  return (
    <div className="tw-w-full tw-flex tw-justify-start tw-items-center tw-whitespace-nowrap">
      <DirectionLabel position={position}>{name}</DirectionLabel>
    </div>
  );
}
