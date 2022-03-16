import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import type { OpenLoanType } from 'types/active-loan';
import { translations } from 'locales/i18n';
import { LiquidatedPositionRow } from './LiquidatedPositionRow';
import { Icon, Popover } from '@blueprintjs/core';
interface ILiquidatedPositionsTableProps {
  liquidateLoans: OpenLoanType[];
  isOpenPosition: boolean;
  isLong: boolean;
}

export const LiquidatedPositionsTable: React.FC<ILiquidatedPositionsTableProps> = ({
  liquidateLoans,
  isOpenPosition,
  isLong,
}) => {
  const { t } = useTranslation();
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
              {liquidateLoans.map(item => (
                <LiquidatedPositionRow
                  positionStatus={isOpenPosition}
                  liquidatedLoan={item}
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
