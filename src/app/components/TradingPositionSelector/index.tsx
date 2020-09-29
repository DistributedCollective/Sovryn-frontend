/**
 *
 * TradingPositionSelector
 *
 */
import React from 'react';
import { TradingPosition } from '../../../types/trading-position';
import styled, { ThemeProvider } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLongArrowAltUp,
  faLongArrowAltDown,
} from '@fortawesome/free-solid-svg-icons';

interface Props {
  value: TradingPosition;
  onChange: (value: TradingPosition) => void;
}

export function TradingPositionSelector(props: Props) {
  const long = props.value === 'LONG';

  const active = {
    color: long ? 'var(--Teal)' : 'var(--Gold)',
    textColor: 'var(--white)',
  };
  const inactive = {
    color: 'var(--Grey_text)',
    textColor: 'var(--Grey_text)',
  };

  return (
    <>
      <div className="row">
        <div className="col-6 p-0 pl-3">
          <ThemeProvider theme={long ? active : inactive}>
            <Tab
              className="p-3 bg-TabGrey text-center"
              style={{ marginRight: '1px', cursor: 'pointer' }}
              onClick={() => props.onChange(TradingPosition.LONG)}
            >
              <h3 className="my-1">
                <FontAwesomeIcon icon={faLongArrowAltUp} /> <span>Long</span>
              </h3>
            </Tab>
          </ThemeProvider>
        </div>
        <div className="col-6 p-0 pr-3">
          <ThemeProvider theme={long ? inactive : active}>
            <Tab
              className="p-3 bg-TabGrey text-center"
              style={{ marginLeft: '1px', cursor: 'pointer' }}
              onClick={() => props.onChange(TradingPosition.SHORT)}
            >
              <h3 className="my-1">
                <FontAwesomeIcon icon={faLongArrowAltDown} /> <span>Short</span>
              </h3>
            </Tab>
          </ThemeProvider>
        </div>
      </div>
    </>
  );
}

const Tab = styled.div`
  cursor: pointer;
  border-bottom: ${props => `2px solid ${props.theme.color}`};
  color: ${props => props.theme.color};
  h3 span {
    color: ${props => props.theme.textColor};
  }
`;

TradingPositionSelector.defaultProps = {
  value: TradingPosition.LONG,
  onChange: (value: TradingPosition) => {},
};
