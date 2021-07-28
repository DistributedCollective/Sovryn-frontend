/**
 *
 * ActiveLoanTableContainer
 *
 */
import React, { useEffect, useState } from 'react';
import { Icon, Tooltip } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import { bignumber } from 'mathjs';
import { translations } from 'locales/i18n';
import { ClosePositionDialog } from '../../../../pages/MarginTradePage/components/ClosePositionDialog';
import { AddToMarginDialog } from '../../../../pages/MarginTradePage/components/AddToMarginDialog';
import { ActiveLoanTableMobile } from '../ActiveLoanTableMobile';
import { ActiveLoanTableDesktop } from '../ActiveLoanTableDesktop';
import {
  assetByTokenAddress,
  symbolByTokenAddress,
} from 'utils/blockchain/contract-helpers';
import { leverageFromMargin } from '../../../../../utils/blockchain/leverage-from-start-margin';
import {
  calculateLiquidation,
  formatAsBTCPrice,
  formatAsNumber,
  stringToPercent,
} from 'utils/display-text/format';
import { TradingPairDictionary } from '../../../../../utils/dictionaries/trading-pair-dictionary';
import { AssetsDictionary } from '../../../../../utils/dictionaries/assets-dictionary';
import { CurrentPositionPrice } from '../../../CurrentPositionPrice';
import { CurrentPositionProfit } from '../../../CurrentPositionProfit';
import { useMaintenance } from '../../../../hooks/useMaintenance';
import styles from './ActiveLoanTableContainer.module.css';

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
  const { checkMaintenances, States } = useMaintenance();
  const {
    [States.OPEN_MARGIN_TRADES]: openTradesLocked,
    [States.CLOSE_MARGIN_TRADES]: closeTradesLocked,
  } = checkMaintenances();

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
        positionSize: item.collateral,
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
            startPrice={startPrice}
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
          <div className="tw-flex tw-flex-row tw-flex-nowrap tw-justify-end">
            <div
              className={`tw-mr-1 ${openTradesLocked ? styles.disabled : ''}`}
            >
              <Tooltip
                content={
                  openTradesLocked
                    ? t(translations.maintenance.openMarginTrades)
                    : t(translations.activeLoan.table.container.topUp)
                }
              >
                <Icon
                  icon="double-chevron-up"
                  className="tw-text-green-500 tw-mr-1 tw-rounded-full tw-border tw-border-green-500 tw-p-1"
                  iconSize={20}
                  onClick={e => {
                    e.stopPropagation();
                    if (!openTradesLocked) {
                      setPositionMarginModalOpen(true);
                      setSelectedItem(item);
                    }
                  }}
                />
              </Tooltip>
            </div>
            <div className={`${closeTradesLocked ? styles.disabled : ''}`}>
              <Tooltip
                content={
                  closeTradesLocked
                    ? t(translations.maintenance.closeMarginTrades)
                    : t(translations.activeLoan.table.container.close)
                }
              >
                <Icon
                  icon="cross"
                  className="tw-text-red-500 tw-ml-1 tw-rounded tw-border tw-border-red-500 tw-p-1"
                  iconSize={20}
                  onClick={e => {
                    e.stopPropagation();
                    if (!closeTradesLocked) {
                      setPositionCloseModalOpen(true);
                      setSelectedItem(item);
                    }
                  }}
                />
              </Tooltip>
            </div>
          </div>
        ),
      };
    });
  }, [props.data, t, openTradesLocked, closeTradesLocked]);

  useEffect(() => {
    // Resets selected item in modals if items was changed.
    setSelectedItem(selectedItem => {
      if (selectedItem) {
        return props.data.find(item => item.loanId === selectedItem.loanId);
      }
      return selectedItem;
    });
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
      <ClosePositionDialog
        item={selectedItem}
        showModal={positionCloseModalOpen}
        onCloseModal={() => setPositionCloseModalOpen(false)}
      />

      {selectedItem && (
        <AddToMarginDialog
          item={selectedItem}
          showModal={positionMarginModalOpen}
          onCloseModal={() => setPositionMarginModalOpen(false)}
        />
      )}
    </>
  );
}
