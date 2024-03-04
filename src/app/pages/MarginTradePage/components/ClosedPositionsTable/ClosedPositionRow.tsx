import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { TradingPairDictionary } from 'utils/dictionaries/trading-pair-dictionary';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import { TradingPosition } from 'types/trading-position';
import { PositionBlock } from '../PositionBlock';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { TradeProfit } from 'app/components/TradeProfit';
import {
  getClosePositionPrice,
  getExitTransactionHash,
  getOpenPositionPrice,
} from '../../utils/marginUtils';
import { ActionButton } from 'app/components/Form/ActionButton';
import { PositionEventsTable } from '../PositionEventsTable';
import { AssetValue } from 'app/components/AssetValue';
import { toWei } from 'utils/blockchain/math-helpers';
import { MarginLoansFieldsFragment } from 'utils/graphql/rsk/generated';
import { DEFAULT_TRADE } from '../../types';

type ClosedPositionRowProps = {
  event: MarginLoansFieldsFragment;
};

export const ClosedPositionRow: React.FC<ClosedPositionRowProps> = ({
  event,
}) => {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);
  const {
    trade,
    loanToken: { id: loanTokenId },
    collateralToken: { id: collateralTokenId },
    liquidates,
    closeWithSwaps,
    positionSize: positionSizeValue,
  } = event;
  const entryLeverage = trade?.[0].entryLeverage || DEFAULT_TRADE.entryLeverage;
  const positionSize = positionSizeValue || DEFAULT_TRADE.positionSize;
  const entryPrice = trade?.[0].entryPrice || DEFAULT_TRADE.entryPrice;
  const transaction = trade?.[0].transaction.id || DEFAULT_TRADE.transactionId;
  const loanAsset = assetByTokenAddress(loanTokenId);
  const collateralAsset = assetByTokenAddress(collateralTokenId);
  const pair = TradingPairDictionary.findPair(loanAsset, collateralAsset);

  const position =
    pair?.longAsset === loanAsset
      ? TradingPosition.LONG
      : TradingPosition.SHORT;

  const leverage = useMemo(() => Number(entryLeverage) + 1, [entryLeverage]);
  const openPrice = useMemo(() => getOpenPositionPrice(entryPrice, position), [
    entryPrice,
    position,
  ]);

  const closePrice = useMemo(
    () =>
      getClosePositionPrice(liquidates || [], closeWithSwaps || [], position),
    [liquidates, closeWithSwaps, position],
  );

  const exitTransactionHash = useMemo(
    () => getExitTransactionHash(liquidates || [], closeWithSwaps || []),
    [liquidates, closeWithSwaps],
  );

  return (
    <>
      <tr>
        <td>
          <PositionBlock position={position} name={pair.name} />
        </td>
        <td className="tw-hidden xl:tw-table-cell">
          <div className="tw-whitespace-nowrap">
            <AssetValue
              asset={collateralAsset}
              value={toWei(positionSize)}
              useTooltip
            />
          </div>
        </td>
        <td className="tw-hidden xl:tw-table-cell">
          <div>{leverage}x</div>
        </td>
        <td className="tw-hidden md:tw-table-cell">
          <div className="tw-whitespace-nowrap">
            <AssetValue
              asset={pair.longDetails.asset}
              value={toWei(openPrice)}
              useTooltip
            />
          </div>
        </td>
        <td className="tw-hidden md:tw-table-cell">
          <div className="tw-whitespace-nowrap">
            <AssetValue
              asset={pair.longDetails.asset}
              value={toWei(closePrice)}
              useTooltip
            />
          </div>
        </td>
        <td>
          <TradeProfit
            positionSize={positionSize}
            collateralAsset={collateralAsset}
            position={position}
            openPrice={openPrice}
            closePrice={closePrice}
          />
        </td>
        <td className="tw-hidden xl:tw-table-cell">
          <LinkToExplorer
            className="tw-text-primary tw-truncate tw-m-0"
            txHash={transaction}
            startLength={5}
            endLength={5}
          />
        </td>
        <td className="tw-hidden xl:tw-table-cell">
          <LinkToExplorer
            className="tw-text-primary tw-truncate tw-m-0"
            txHash={exitTransactionHash}
            startLength={5}
            endLength={5}
          />
        </td>
        <td>
          <div className="tw-flex tw-items-center tw-justify-end xl:tw-justify-around 2xl:tw-justify-start">
            <ActionButton
              text={t(translations.tradingHistoryPage.table.cta.details)}
              onClick={() => setShowDetails(!showDetails)}
              className="tw-border-none tw-ml-0 tw-pl-4 xl:tw-pl-2 tw-pr-0"
              textClassName="tw-text-xs tw-overflow-visible tw-font-bold"
              data-action-id="margin-openPositions-DetailsButton"
            />
          </div>
        </td>
      </tr>
      {showDetails && (
        <PositionEventsTable
          isOpenPosition={false}
          event={event}
          isLong={position === TradingPosition.LONG}
          position={position}
        />
      )}
    </>
  );
};
