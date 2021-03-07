/**
 *
 * TradingPositionSelector
 *
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Text } from '@blueprintjs/core';
import { faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons/faArrowAltCircleUp';
import { faArrowAltCircleDown } from '@fortawesome/free-solid-svg-icons/faArrowAltCircleDown';
import { TradingPosition } from 'types/trading-position';
import { translations } from 'locales/i18n';

interface Props {
  value: TradingPosition;
  onChange: (value: TradingPosition) => void;
}

export function TradingPositionSelector(props: Props) {
  const { t } = useTranslation();
  return (
    <div className="tw-grid tw-grid-cols-12 tw-mb-4">
      <div className="tw-col-span-6 tw-pr-1">
        <Tab
          type={TradingPosition.LONG}
          active={props.value === TradingPosition.LONG}
          text={t(translations.trandingPositionSelector.long)}
          onClick={value => props.onChange(value)}
        />
      </div>
      <div className="tw-col-span-6 tw-pl-1">
        <Tab
          type={TradingPosition.SHORT}
          active={props.value === TradingPosition.SHORT}
          text={t(translations.trandingPositionSelector.short)}
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
      className={`tw-w-full btn tw-px-1 lg:tw-px-4 tw-py-2 text-dark tw-font-bold tw-uppercase tw-flex tw-flex-row tw-items-center tw-justify-center ${classes}`}
      onClick={() => props.onClick(props.type)}
    >
      <FontAwesomeIcon icon={icon} className="tw-mr-1 lg:tw-mr-3" />
      <Text ellipsize tagName="span" className="font-size-lg">
        {props.text}
      </Text>
    </button>
  );
}
