import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Icon, Popover } from '@blueprintjs/core';
import { translations } from 'locales/i18n';
import { Asset } from 'types';
import type { LoanEvent } from '../OpenPositionsTable/hooks/useMargin_getLoanEvents';
import { EventType } from '../../types';
import { PositionEventRow } from './PositionEventRow';
import {
  getCloseEventData,
  getDepositEventData,
  getLiquidateEventData,
  getTradeEventData,
} from './utils';

type LiquidatedPositionsTableProps = {
  events: LoanEvent[];
  isOpenPosition: boolean;
  isLong: boolean;
};

export type PositionEvent = {
  event: EventType;
  positionChange: string;
  price: string;
  positionAsset: Asset;
  collateralAsset: Asset;
  time: number;
  txHash: string;
  positionSubtracted?: boolean;
};

export const PositionEventsTable: React.FC<LiquidatedPositionsTableProps> = ({
  events,
  isOpenPosition,
  isLong,
}) => {
  const { t } = useTranslation();

  const items = useMemo(
    () =>
      events
        .map(item => {
          switch (item.event) {
            case EventType.TRADE:
              return getTradeEventData(item, isLong);
            case EventType.DEPOSIT:
              return getDepositEventData(item, isLong);
            case EventType.LIQUIDATE:
              return getLiquidateEventData(item, isLong);
            case EventType.CLOSED:
              return getCloseEventData(item, isLong);
            default:
              return null;
          }
        })
        .filter(item => !!item) as PositionEvent[],
    [events, isLong],
  );

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
              {items.map(item => (
                <PositionEventRow
                  key={item.txHash}
                  positionStatus={isOpenPosition}
                  event={item}
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
