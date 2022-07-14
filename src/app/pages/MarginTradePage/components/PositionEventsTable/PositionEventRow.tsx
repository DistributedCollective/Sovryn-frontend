import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import { bignumber } from 'mathjs';
import { AssetValue } from 'app/components/AssetValue';
import { toWei } from 'utils/blockchain/math-helpers';
import {
  MarginLoansCloseWithSwapFragment,
  MarginLoansDepositCollateralFragment,
  MarginLoansLiquidateFragment,
  MarginLoansTradeFragment,
} from 'utils/graphql/rsk/generated';
import { EventType } from '../../types';

type LiquidatedPositionRowProps = {
  event:
    | MarginLoansCloseWithSwapFragment
    | MarginLoansDepositCollateralFragment
    | MarginLoansLiquidateFragment
    | MarginLoansTradeFragment;
  isLong: boolean;
  positionToken: string;
  collateralToken: string;
  positionSize: string;
  closePrice?: string;
};

export const PositionEventRow: React.FC<LiquidatedPositionRowProps> = ({
  event,
  positionToken,
  collateralToken,
  positionSize,
  closePrice,
  isLong,
}) => {
  const { t } = useTranslation();
  const timestamp = useMemo(
    () => new Date(event.timestamp).getTime().toString(),
    [event],
  );
  const loanAsset = assetByTokenAddress(positionToken);
  const collateralAsset = assetByTokenAddress(collateralToken);

  const exitPrice = useMemo(() => {
    if (!closePrice) {
      return false;
    }
    if (event.__typename === EventType.LIQUIDATE) {
      return closePrice;
    }
    return isLong ? bignumber(1).div(closePrice).toString() : closePrice;
  }, [closePrice, isLong, event]);

  const isLiquidateEvent = useMemo(
    () => (event.__typename === EventType.LIQUIDATE ? '-' : ''),
    [event],
  );

  return (
    <tr>
      <td>
        {event.__typename ? t(translations.tradeEvents[event.__typename]) : '-'}
      </td>
      <td className="tw-hidden md:tw-table-cell">
        <div className="tw-whitespace-nowrap">
          {isLiquidateEvent}
          <AssetValue
            asset={collateralAsset}
            value={toWei(positionSize)}
            useTooltip
          />
        </div>
      </td>
      <td>
        <div className="tw-whitespace-nowrap">
          {exitPrice ? (
            <AssetValue asset={loanAsset} value={toWei(exitPrice)} useTooltip />
          ) : (
            <>-</>
          )}
        </div>
      </td>
      <td className="tw-hidden md:tw-table-cell">
        <DisplayDate timestamp={timestamp} />
      </td>
      <td className="tw-hidden sm:tw-table-cell">
        <LinkToExplorer
          txHash={event.transaction.id}
          className="tw-text-primary tw-truncate tw-m-0"
          startLength={5}
          endLength={5}
        />
      </td>
    </tr>
  );
};
