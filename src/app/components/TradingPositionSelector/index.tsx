/**
 *
 * TradingPositionSelector
 *
 */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Text } from '@blueprintjs/core';
import { faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons/faArrowAltCircleUp';
import { faArrowAltCircleDown } from '@fortawesome/free-solid-svg-icons/faArrowAltCircleDown';
import { TradingPosition } from 'types/trading-position';

interface Props {
  value: TradingPosition;
  onChange: (value: TradingPosition) => void;
}

export function TradingPositionSelector(props: Props) {
  return (
    <div className="row mb-3">
      <div className="col-6 pr-1">
        <Tab
          type={TradingPosition.LONG}
          active={props.value === TradingPosition.LONG}
          text="Long"
          onClick={value => props.onChange(value)}
        />
      </div>
      <div className="col-6 pl-1">
        <Tab
          type={TradingPosition.SHORT}
          active={props.value === TradingPosition.SHORT}
          text="Short"
          onClick={value => props.onChange(value)}
        />
      </div>
    </div>
  );
}

TradingPositionSelector.defaultProps = {
  value: TradingPosition.LONG,
  onChange: (_: TradingPosition) => {},
};

interface TabProps {
  text: React.ReactNode;
  type: TradingPosition;
  active: boolean;
  onClick: (value: TradingPosition) => void;
}

function Tab(props: TabProps) {
  const icon =
    props.type === TradingPosition.LONG
      ? faArrowAltCircleUp
      : faArrowAltCircleDown;
  const classes = props.active
    ? props.type === TradingPosition.LONG
      ? 'bg-long'
      : 'bg-short'
    : 'bg-muted';

  return (
    <button
      type="button"
      className={`w-100 btn px-1 px-lg-3 py-2 text-dark font-weight-bold text-uppercase d-flex flex-row align-items-center justify-content-center ${classes}`}
      onClick={() => props.onClick(props.type)}
    >
      <FontAwesomeIcon icon={icon} className="mr-1 mr-lg-3" />
      <Text ellipsize tagName="span" className="font-size-lg">
        {props.text}
      </Text>
    </button>
  );
}
