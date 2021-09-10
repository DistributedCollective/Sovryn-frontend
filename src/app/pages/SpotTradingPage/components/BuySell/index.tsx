import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button';
import { TradingTypes } from '../../types';
import { translations } from 'locales/i18n';

interface Props {
  value: TradingTypes;
  onChange: (value: TradingTypes) => void;
}

export function BuySell({ value, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <div className="tw-flex tw-items-center">
      <Button
        className="tw-mr-1"
        small
        text={t(translations.spotTradingPage.tradeForm.buy)}
        tradingType={TradingTypes.BUY}
        onClick={() => onChange(TradingTypes.BUY)}
        disabled={value !== TradingTypes.BUY}
      />
      <Button
        className="tw-ml-1"
        small
        text={t(translations.spotTradingPage.tradeForm.sell)}
        tradingType={TradingTypes.SELL}
        onClick={() => onChange(TradingTypes.SELL)}
        disabled={value !== TradingTypes.SELL}
      />
    </div>
  );
}
