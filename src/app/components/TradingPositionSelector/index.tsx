/**
 *
 * TradingPositionSelector
 *
 */
import React from 'react';
import { TradingPosition } from '../../../types/trading-position';
import { Button, ButtonGroup } from '@blueprintjs/core';

interface Props {
  value: TradingPosition;
  onChange: (value: TradingPosition) => void;
}

export function TradingPositionSelector(props: Props) {
  return (
    <ButtonGroup>
      <Button
        text={'Long'}
        active={TradingPosition.LONG === props.value}
        onClick={() => props.onChange(TradingPosition.LONG)}
      />
      <Button
        text={'Short'}
        active={TradingPosition.SHORT === props.value}
        onClick={() => props.onChange(TradingPosition.SHORT)}
      />
    </ButtonGroup>
  );
}

TradingPositionSelector.defaultProps = {
  value: TradingPosition.LONG,
  onChange: (value: TradingPosition) => {},
};
