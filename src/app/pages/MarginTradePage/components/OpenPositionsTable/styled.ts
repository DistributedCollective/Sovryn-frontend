import styled from 'styled-components/macro';
import { TradingPosition } from 'types/trading-position';

interface DirectionBlockProps {
  position: TradingPosition;
}

export const DirectionBlock = styled.div`
  width: 40px;
  height: 60px;
  border-radius: 8px;
  background-color: ${(props: DirectionBlockProps) =>
    props.position === TradingPosition.LONG ? '#17C3B2' : '#D74E09'};
`;

export const DirectionLabel = styled.div`
  margin-left: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${(props: DirectionBlockProps) =>
    props.position === TradingPosition.LONG ? '#17C3B2' : '#D74E09'};
`;
