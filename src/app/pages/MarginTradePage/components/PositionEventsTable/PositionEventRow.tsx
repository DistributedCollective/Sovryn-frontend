import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { weiToAssetNumberFormat } from 'utils/display-text/format';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { PositionEvent } from '.';
import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';

type LiquidatedPositionRowProps = {
  event: PositionEvent;
  positionStatus: boolean;
  isLong: boolean;
};

export const PositionEventRow: React.FC<LiquidatedPositionRowProps> = ({
  event,
}) => {
  const { t } = useTranslation();
  const timestamp = useMemo(() => new Date(event.time).getTime().toString(), [
    event,
  ]);

  return (
    <tr>
      <td>{t(translations.tradeEvents[event.event])}</td>
      <td className="tw-hidden md:tw-table-cell">
        <div className="tw-whitespace-nowrap">
          {event.positionSubtracted && <>-</>}
          {weiToAssetNumberFormat(
            event.positionChange,
            event.positionAsset,
          )}{' '}
          <AssetRenderer asset={event.positionAsset} />
        </div>
      </td>
      <td>
        <div className="tw-whitespace-nowrap">
          {event.price ? (
            <>
              {weiToAssetNumberFormat(event.price, event.collateralAsset)}{' '}
              <AssetRenderer asset={event.collateralAsset} />
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
          txHash={event.txHash}
          className="tw-text-primary tw-truncate tw-m-0"
          startLength={5}
          endLength={5}
        />
      </td>
    </tr>
  );
};
