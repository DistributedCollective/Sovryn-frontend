import React from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonTrade } from 'app/components/ButtonTrade';
import { TradingTypes } from '../../types';
import { translations } from 'locales/i18n';
import classNames from 'classnames';

interface Props {
  value: TradingTypes;
  onChange: (value: TradingTypes) => void;
}

export function BuySell({ value, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-space-x-4 tw-mw-340 tw-mx-auto">
      <ButtonTrade
        className={classNames('tw-h-8 tw-capitalize', {
          'tw-opacity-50': value !== TradingTypes.BUY,
        })}
        text={t(translations.spotTradingPage.tradeForm.buy)}
        tradingType={TradingTypes.BUY}
        onClick={() => onChange(TradingTypes.BUY)}
        data-action-id="spot-buy"
      />
      <ButtonTrade
        className={classNames('tw-h-8 tw-capitalize', {
          'tw-opacity-50': value !== TradingTypes.SELL,
        })}
        text={t(translations.spotTradingPage.tradeForm.sell)}
        tradingType={TradingTypes.SELL}
        onClick={() => onChange(TradingTypes.SELL)}
        data-action-id="spot-sell"
      />
    </div>
  );
}
