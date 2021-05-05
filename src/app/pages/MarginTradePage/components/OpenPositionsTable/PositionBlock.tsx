import React, { ReactNode } from 'react';
import { TradingPosition } from 'types/trading-position';
import { DirectionBlock, DirectionLabel } from './styled';

export function PositionBlock({
  position,
  name,
}: {
  position: TradingPosition;
  name: ReactNode;
}) {
  return (
    <div className="tw-w-full tw-flex tw-justify-start tw-items-center">
      <DirectionBlock position={position} />
      <DirectionLabel position={position}>{name}</DirectionLabel>
    </div>
  );
}
