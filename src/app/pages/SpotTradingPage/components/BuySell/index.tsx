import React from 'react';
import { useTranslation } from 'react-i18next';
import RadioGroup from 'app/components/Form/RadioGroup';
import { TradingTypes } from '../../types';
import { translations } from 'locales/i18n';

interface Props {
  value: string;
  onChange: (value: TradingTypes) => void;
}

export function BuySell({ value, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <RadioGroup
        value={value}
        onChange={value => onChange(value as TradingTypes)}
        className="tw-radio-group--primary"
      >
        <RadioGroup.Button
          className="tw-bg-trade-long tw-btn-trade-content"
          value={TradingTypes.BUY}
          text={t(translations.spotTradingPage.tradeForm.buy)}
        />
        <RadioGroup.Button
          className="tw-bg-trade-short tw-btn-trade-content"
          value={TradingTypes.SELL}
          text={t(translations.spotTradingPage.tradeForm.sell)}
        />
      </RadioGroup>
    </>
  );
}
