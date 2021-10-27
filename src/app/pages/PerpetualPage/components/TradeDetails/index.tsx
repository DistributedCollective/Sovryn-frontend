import classNames from 'classnames';
import { bignumber } from 'mathjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toWei } from 'web3-utils';
import { translations } from '../../../../../locales/i18n';
import { TradingPosition } from '../../../../../types/trading-position';
import { toNumberFormat } from '../../../../../utils/display-text/format';
import { PerpetualPair } from '../../../../../utils/models/perpetual-pair';
import { AssetValue } from '../../../../components/AssetValue';
import { AssetValueMode } from '../../../../components/AssetValue/types';
import { AvailableBalance } from '../../../../components/AvailableBalance';
import { usePerpetual_accountBalance } from '../../hooks/usePerpetual_accountBalance';
import { PerpetualTrade } from '../../types';

type TradeDetailsProps = {
  className?: string;
  pair: PerpetualPair;
  trade: PerpetualTrade;
};

export const TradeDetails: React.FC<TradeDetailsProps> = ({
  className,
  pair,
  trade,
}) => {
  const { t } = useTranslation();

  const { available } = usePerpetual_accountBalance(pair.pairType);

  return (
    <div
      className={classNames(
        'tw-px-4 tw-py-2 tw-bg-gray-4 tw-rounded-lg',
        className,
      )}
    >
      <div className="tw-flex tw-flex-row tw-items-center tw-text-xs">
        <label className="tw-w-1/2 tw-mr-2">
          {t(translations.perpetualPage.currentTrade.position)}
        </label>
        <AssetValue
          className="tw-text-trade-long tw-font-medium"
          minDecimals={3}
          maxDecimals={3}
          mode={AssetValueMode.auto}
          value={trade.amount}
          assetString={pair.shortAsset}
        />
      </div>

      <div className="tw-flex tw-flex-row tw-items-center tw-text-xs">
        <label className="tw-w-1/2 tw-mr-2">
          {t(translations.perpetualPage.currentTrade.margin)}
        </label>
        <div>
          <AssetValue
            className="tw-font-medium"
            minDecimals={4}
            maxDecimals={4}
            mode={AssetValueMode.auto}
            value={bignumber(trade.amount)
              .mul(trade.leverage + 1)
              .toString()}
            assetString={pair.shortAsset}
          />
          <span className="tw-font-medium tw-ml-1">
            ({toNumberFormat(trade.leverage, 2)}x)
          </span>
        </div>
      </div>

      <div className="tw-flex tw-flex-row tw-items-center tw-text-xs">
        <label className="tw-w-1/2 tw-mr-2">
          {t(translations.perpetualPage.currentTrade.available)}
        </label>
        <AssetValue
          className="tw-font-medium"
          minDecimals={3}
          maxDecimals={3}
          mode={AssetValueMode.auto}
          value={available}
          assetString={pair.shortAsset}
        />
      </div>
    </div>
  );
};
