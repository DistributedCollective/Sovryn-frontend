import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Icon, Popover } from '@blueprintjs/core';
import { translations } from 'locales/i18n';
import { PositionEventRow } from './PositionEventRow';
import { TradingPosition } from 'types/trading-position';
import { MarginLoansFieldsFragment } from 'utils/graphql/rsk/generated';
import {
  EventCloseWithSwaps,
  EventDepositCollateral,
  EventLiquidates,
  EventTrade,
} from '../../types';

type LiquidatedPositionsTableProps = {
  event: MarginLoansFieldsFragment;
  isOpenPosition: boolean;
  isLong: boolean;
  position: TradingPosition;
};

export const PositionEventsTable: React.FC<LiquidatedPositionsTableProps> = ({
  event,
  isLong,
}) => {
  const { t } = useTranslation();
  const { trade, liquidates, depositCollateral, closeWithSwaps } = event;

  return (
    <>
      <tr>
        <td
          colSpan={10}
          className="tw-p-2 tw-border tw-border-gray tw-rounded-2xl"
        >
          <table className="tw-table tw-table-auto">
            <thead>
              <tr className="tw-bg-transparent">
                <th>{t(translations.openPositionTable.event)}</th>
                <th className="tw-hidden md:tw-table-cell">
                  {t(translations.openPositionTable.positionChange)}
                </th>
                <th>
                  {t(translations.openPositionTable.closingPrice)}
                  <Popover
                    content={
                      <div className="tw-px-12 tw-py-8 tw-font-light">
                        <Trans
                          i18nKey={
                            translations.openPositionTable.explainers
                              .closingPrice
                          }
                          components={[<strong className="tw-font-bold" />]}
                        />
                      </div>
                    }
                    className="tw-pl-2"
                  >
                    <Icon className="tw-cursor-pointer" icon="info-sign" />
                  </Popover>
                </th>
                <th className="tw-hidden md:tw-table-cell">
                  {t(translations.openPositionTable.timestamp)}
                </th>
                <th className="tw-hidden sm:tw-table-cell">
                  {t(translations.openPositionTable.txID)}
                </th>
              </tr>
            </thead>
            <tbody>
              {trade?.map(item => (
                <PositionEventRow
                  key={item.id}
                  event={item as EventTrade}
                  positionToken={item.loanToken.id}
                  collateralToken={item.collateralToken.id}
                  positionSize={item.positionSize}
                  closePrice={item.entryPrice}
                  isLong={isLong}
                />
              ))}
              {liquidates?.map(item => (
                <PositionEventRow
                  key={item.id}
                  event={item as EventLiquidates}
                  positionToken={item.loanToken}
                  collateralToken={item.collateralToken}
                  positionSize={item.collateralWithdrawAmount}
                  closePrice={item.collateralToLoanRate}
                  isLong={isLong}
                />
              ))}
              {depositCollateral?.map(item => (
                <PositionEventRow
                  key={item.id}
                  event={item as EventDepositCollateral}
                  positionToken={event.trade ? event.trade[0].loanToken.id : ''}
                  collateralToken={
                    event.trade ? event.trade[0].collateralToken.id : ''
                  }
                  positionSize={item.depositAmount}
                  isLong={isLong}
                />
              ))}
              {closeWithSwaps?.map(item => (
                <PositionEventRow
                  key={item.id}
                  event={item as EventCloseWithSwaps}
                  positionToken={item.loanToken}
                  collateralToken={item.collateralToken}
                  positionSize={item.positionCloseSize}
                  closePrice={item.exitPrice}
                  isLong={isLong}
                />
              ))}
            </tbody>
          </table>
        </td>
      </tr>
    </>
  );
};
