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
import { ActiveLoanTableMobile } from '../ActiveLoanTableMobile';
import { ActiveLoanTableDesktop } from '../ActiveLoanTableDesktop';
import {
  assetByTokenAddress,
  symbolByTokenAddress,
} from 'utils/blockchain/contract-helpers';
import { leverageFromMargin } from '../../../../../utils/blockchain/leverage-from-start-margin';
import {
  formatAsBTCPrice,
  stringToPercent,
  formatAsNumber,
  calculateLiquidation,
} from 'utils/display-text/format';
import { TradingPairDictionary } from '../../../../../utils/dictionaries/trading-pair-dictionary';
import { AssetsDictionary } from '../../../../../utils/dictionaries/assets-dictionary';
import { CurrentPositionPrice } from '../../../CurrentPositionPrice';
import { CurrentPositionProfit } from '../../../CurrentPositionProfit';
import { bignumber } from 'mathjs';

interface Props {
  data: any;
  activeTrades: boolean;
}

export function ActiveLoanTableContainer(props: Props) {
  const [positionCloseModalOpen, setPositionCloseModalOpen] = useState(false);
  const [positionMarginModalOpen, setPositionMarginModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(props.data[0]);
  const [expandedItem, setExpandedItem] = useState('');
  const [expandedId, setExpandedId] = useState('');
  const { t } = useTranslation();

  const data = React.useMemo(() => {
    return props.data.map(item => {
      const currentMargin = formatAsNumber(item.currentMargin, 4);
      const startMargin = formatAsNumber(item.startMargin, 4);
      const currency = symbolByTokenAddress(item.collateralToken);
      const loanAsset = assetByTokenAddress(item.loanToken);
      const collateralAsset = assetByTokenAddress(item.collateralToken);

      const isLong = TradingPairDictionary.longPositionTokens.includes(
        loanAsset,
      );
      const startPrice = formatAsBTCPrice(item.startRate, isLong);
      const leverage = leverageFromMargin(item.startMargin);

      const amount = bignumber(item.collateral).div(leverage).toFixed(0);

      return {
        id: item.loanId,
        pair: isLong
          ? `${AssetsDictionary.get(collateralAsset).symbol} / ${
              AssetsDictionary.get(loanAsset).symbol
            }`
          : `${AssetsDictionary.get(loanAsset).symbol} / ${
              AssetsDictionary.get(collateralAsset).symbol
            }`,
        currency: currency,
        icon: isLong ? 'LONG' : 'SHORT',
        positionSize: formatAsNumber(item.collateral, 4),
        positionInUSD: formatAsNumber(item.collateral, 4),
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
        leverage,
        profit: (
          <CurrentPositionProfit
            source={loanAsset}
            destination={collateralAsset}
            amount={amount}
            startRate={item.startRate}
            isLong={isLong}
          />
        ),
        liquidationPrice: calculateLiquidation(
          isLong,
          leverageFromMargin(item.startMargin),
          item.maintenanceMargin,
          item.startRate,
        ),
        currentPrice: (
          <CurrentPositionPrice
            source={loanAsset}
            destination={collateralAsset}
            amount={amount}
            isLong={isLong}
          />
        ),
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
  }, [props.data, t]);

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
