/**
 *
 * ActiveLoanTableContainer
 *
 */
import React, { useEffect, useState } from 'react';
import { Icon, Tooltip } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { CloseTradingPositionHandler } from '../../../../containers/CloseTradingPositionHandler';
import { TopUpTradingPositionHandler } from '../../../../containers/TopUpTradingPositionHandler';
import { ActiveLoanLiquidation } from '../ActiveLoanLiquidation';
import { ActiveLoanTableMobile } from '../ActiveLoanTableMobile';
import { ActiveLoanTableDesktop } from '../ActiveLoanTableDesktop';
import {
  assetByTokenAddress,
  symbolByTokenAddress,
} from 'utils/blockchain/contract-helpers';
import { leverageFromMargin } from '../../../../../utils/blockchain/leverage-from-start-margin';
import { Asset } from 'types/asset';
import {
  formatAsBTCPrice,
  stringToPercent,
  formatAsNumber,
  calculateProfit,
} from 'utils/display-text/format';
import { fromWei } from '../../../../../utils/blockchain/math-helpers';
import { TradingPairDictionary } from '../../../../../utils/dictionaries/trading-pair-dictionary';
import { usePriceFeeds_tradingPairRates } from '../../../../hooks/price-feeds/usePriceFeeds_tradingPairRates';
import { AssetsDictionary } from '../../../../../utils/dictionaries/assets-dictionary';
import { CachedAssetRate } from '../../../../containers/WalletProvider/types';

interface Props {
  data: any;
  activeTrades: boolean;
}

function getAssetPrice(source: Asset, target: Asset, items: CachedAssetRate[]) {
  const item = items.find(
    item => item.source === source && item.target === target,
  );
  return item?.value?.rate || '0';
}

export function ActiveLoanTableContainer(props: Props) {
  const [positionCloseModalOpen, setPositionCloseModalOpen] = useState(false);
  const [positionMarginModalOpen, setPositionMarginModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(props.data[0]);
  const [expandedItem, setExpandedItem] = useState('');
  const [expandedId, setExpandedId] = useState('');
  const { t } = useTranslation();

  const items = usePriceFeeds_tradingPairRates();

  const data = React.useMemo(() => {
    return props.data.map((item, i) => {
      const currentMargin = formatAsNumber(item.currentMargin, 4);
      const startMargin = formatAsNumber(item.startMargin, 4);
      const currency = symbolByTokenAddress(item.collateralToken);
      const loanAsset = assetByTokenAddress(item.loanToken);
      const collateralAsset = assetByTokenAddress(item.collateralToken);

      const isLong = TradingPairDictionary.longPositionTokens.includes(
        loanAsset,
      );
      const startPrice = formatAsBTCPrice(item.startRate, isLong);
      const currentRate = parseFloat(
        fromWei(getAssetPrice(loanAsset, collateralAsset, items)),
      );
      const currentPrice = isLong ? 1 / currentRate : currentRate;

      const profit = calculateProfit(
        startPrice,
        currentPrice,
        isLong,
        item.collateral,
        item.startRate,
      );

      return {
        id: item.loanId,
        pair: AssetsDictionary.get(loanAsset).symbol,
        currency: currency,
        icon: isLong ? 'LONG' : 'SHORT',
        positionSize: formatAsNumber(item.collateral, 4),
        positionInUSD: isLong
          ? formatAsNumber(item.collateral, 4) * currentPrice
          : formatAsNumber(item.collateral, 4),
        positionCurrency: symbolByTokenAddress(item.collateralToken),
        currentMargin: currentMargin,
        startMargin: startMargin,
        marginDiff: ((currentMargin - startMargin) * 100) / startMargin,
        interestAPR: (
          ((item.interestOwedPerDay * 365) / item.principal) *
          100
        ).toFixed(2),
        startPrice,
        startRate: item.startRate,
        endDate: new Date(Number(item.endTimestamp) * 1e3).toLocaleString(
          'en-GB',
          {
            timeZone: 'GMT',
          },
        ),
        leverage: leverageFromMargin(item.startMargin),
        profit:
          isNaN(profit) || !isFinite(profit) || !currentPrice ? null : profit,
        liquidationPrice: (
          <ActiveLoanLiquidation
            asset={loanAsset}
            item={item}
            currentPrice={currentPrice}
            isLong={isLong}
          />
        ),
        currentPrice,
        maintenanceMargin: stringToPercent(item.maintenanceMargin, 2),
        actions: (
          <div className="d-flex flex-row flex-nowrap justify-content-end">
            <div className="mr-1">
              <Tooltip
                content={t(translations.activeLoan.table.container.topUp)}
              >
                <Icon
                  icon="double-chevron-up"
                  className="text-green mr-1 rounded-circle border border-green p-1"
                  iconSize={20}
                  onClick={e => {
                    e.stopPropagation();
                    setPositionMarginModalOpen(true);
                    setSelectedItem(item);
                  }}
                />
              </Tooltip>
            </div>
            <div>
              <Tooltip
                content={t(translations.activeLoan.table.container.close)}
              >
                <Icon
                  icon="cross"
                  className="text-red ml-1 rounded-circle border border-red p-1"
                  iconSize={20}
                  onClick={e => {
                    e.stopPropagation();
                    setPositionCloseModalOpen(true);
                    setSelectedItem(item);
                  }}
                />
              </Tooltip>
            </div>
          </div>
        ),
      };
    });
  }, [props.data, t, items]);

  useEffect(() => {
    // Resets selected item in modals if items was changed.
    if (selectedItem && selectedItem.loanId) {
      const loan = props.data.find(item => item.loanId === selectedItem.loanId);
      setSelectedItem(loan);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data]);

  useEffect(() => {
    if (!expandedId) {
      setExpandedItem('');
    }
  }, [expandedId]);

  return (
    <>
      <ActiveLoanTableDesktop
        data={data}
        setExpandedId={setExpandedId}
        setExpandedItem={setExpandedItem}
        expandedId={expandedId}
        expandedItem={expandedItem}
      />
      <ActiveLoanTableMobile
        data={data}
        setExpandedId={setExpandedId}
        expandedId={expandedId}
      />
      <CloseTradingPositionHandler
        item={selectedItem}
        showModal={positionCloseModalOpen}
        onCloseModal={() => setPositionCloseModalOpen(false)}
      />

      {selectedItem && (
        <TopUpTradingPositionHandler
          item={selectedItem}
          showModal={positionMarginModalOpen}
          onCloseModal={() => setPositionMarginModalOpen(false)}
        />
      )}
    </>
  );
}
