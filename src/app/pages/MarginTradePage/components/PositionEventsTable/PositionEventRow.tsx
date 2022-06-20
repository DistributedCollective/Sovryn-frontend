import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { toAssetNumberFormat } from 'utils/display-text/format';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import { bignumber } from 'mathjs';
import {
  EventDepositCollateral,
  EventCloseWithSwaps,
  EventLiquidates,
  EventTrade,
  EventType,
} from '../../types';

type LiquidatedPositionRowProps = {
  event:
    | EventTrade
    | EventLiquidates
    | EventDepositCollateral
    | EventCloseWithSwaps;
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

  return (
    <tr>
      <td>{t(translations.tradeEvents[event.__typename])}</td>
      <td className="tw-hidden md:tw-table-cell">
        <div className="tw-whitespace-nowrap">
          {toAssetNumberFormat(positionSize, collateralAsset)}{' '}
          <AssetRenderer asset={collateralAsset} />
        </div>
      </td>
      <td>
        <div className="tw-whitespace-nowrap">
          {exitPrice ? (
            <>
              {toAssetNumberFormat(exitPrice, loanAsset)}{' '}
              <AssetRenderer asset={loanAsset} />
            </>
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
