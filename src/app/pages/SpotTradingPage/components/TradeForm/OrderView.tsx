import React from 'react';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { OrderType } from 'app/components/OrderTypeTitle/types';
import { useTranslation } from 'react-i18next';
import { Asset } from 'types';
import { stringToFixedPrecision } from 'utils/display-text/format';
import { TradingTypes } from '../../types';
import { OrderLabel } from '../TradeDialog';
import { translations } from 'locales/i18n';
import { PairLabel } from '../TradeDialog';

interface IOrderViewProps {
  tradeType: TradingTypes;
  slippage?: number;
  orderType: OrderType;
  minReturn?: string;
  expectedReturn?: string;
  amount: string;
  targetToken: Asset;
  sourceToken: Asset;
}

export const OrderView: React.FC<IOrderViewProps> = ({
  tradeType,
  orderType,
  amount,
  expectedReturn,
  targetToken,
  sourceToken,
}) => {
  const { t } = useTranslation();
  return (
    <div className="tw-text-center">
      <OrderLabel
        className="tw-text-lg tw-font-semibold tw-mb-1"
        orderType={orderType}
        tradeType={tradeType}
      />
      <PairLabel
        sourceToken={sourceToken}
        targetToken={targetToken}
        tradeType={tradeType}
      />
      <div>
        {stringToFixedPrecision(amount, 6)}{' '}
        <AssetSymbolRenderer asset={sourceToken} />
      </div>
      <div>
        {t(translations.spotTradingPage.tradeForm.receive)}
        <span className="tw-ml-1">
          {expectedReturn} <AssetRenderer asset={targetToken} />
        </span>
      </div>
    </div>
  );
};
