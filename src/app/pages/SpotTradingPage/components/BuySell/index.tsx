import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button';
import { TradingTypes } from '../../types';
import { translations } from 'locales/i18n';
import cn from 'classnames';

interface Props {
  value: TradingTypes;
  onChange: (value: TradingTypes) => void;
}

export function BuySell({ value, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <div className="tw-flex tw-items-center">
      <Button
        className={cn(
          'tw-mr-1 tw-btn-trade tw-h-8 tw-capitalize tw-flex tw-items-center tw-justify-center tw-py-0',
          {
            'tw-opacity-25': value !== TradingTypes.BUY,
          },
        )}
        small
        text={t(translations.spotTradingPage.tradeForm.buy)}
        tradingType={TradingTypes.BUY}
        onClick={() => onChange(TradingTypes.BUY)}
        data-action-id="spot-buy"
      />
      <Button
        className={cn(
          'tw-ml-1 tw-btn-trade tw-h-8 tw-capitalize tw-flex tw-items-center tw-justify-center tw-py-0',
          {
            'tw-opacity-25': value !== TradingTypes.SELL,
          },
        )}
        small
        text={t(translations.spotTradingPage.tradeForm.sell)}
        tradingType={TradingTypes.SELL}
        onClick={() => onChange(TradingTypes.SELL)}
        data-action-id="spot-sell"
      />
    </div>
  );
}
