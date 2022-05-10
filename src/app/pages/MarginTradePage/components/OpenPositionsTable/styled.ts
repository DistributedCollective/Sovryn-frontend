import styled from 'styled-components/macro';
import { TradingPosition } from 'types/trading-position';

interface DirectionBlockProps {
  position: TradingPosition;
}

export const DirectionBlock = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  width: 40px;
  height: 60px;
  border-radius: 0.5rem;
  background-color: ${(props: DirectionBlockProps) =>
    props.position === TradingPosition.LONG ? '#17C3B2' : '#E75E19'};
`;

export const DirectionLabel = styled.div`
  margin-left: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${(props: DirectionBlockProps) =>
    props.position === TradingPosition.LONG ? '#17C3B2' : '#E75E19'};
`;
