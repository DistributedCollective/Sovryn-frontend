import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { HashZero } from '@ethersproject/constants';
import { DialogButton } from 'app/components/Form/DialogButton';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { useMaintenance } from 'app/hooks/useMaintenance';
import {
  discordInvite,
  useTenderlySimulator,
  MAINTENANCE_MARGIN,
} from 'utils/classifiers';
import { translations } from 'locales/i18n';
import { Asset, Nullable } from 'types';
import {
  getLendingContractName,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';
import { toWei } from 'utils/blockchain/math-helpers';
import { TradingPairDictionary } from 'utils/dictionaries/trading-pair-dictionary';
import {
  toAssetNumberFormat,
  toNumberFormat,
  weiToAssetNumberFormat,
  weiToNumberFormat,
} from 'utils/display-text/format';
import { LabelValuePair } from 'app/components/LabelValuePair';
import { useTrading_resolvePairTokens } from 'app/hooks/trading/useTrading_resolvePairTokens';
import { useAccount } from 'app/hooks/useAccount';
import { TxFeeCalculator } from '../TxFeeCalculator';
import { TradingPosition } from 'types/trading-position';
import { selectMarginTradePage } from '../../selectors';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { OrderType } from 'app/components/OrderTypeTitle/types';
import { TradeDialogInfo } from './TradeDialogInfo';
import { SimulationStatus } from 'app/hooks/simulator/useFilterSimulatorResponseLogs';
import { LoadableValue } from 'app/components/LoadableValue';
import { PricePrediction } from 'app/containers/MarginTradeForm/PricePrediction';
import { MarginDetails } from 'app/hooks/trading/useGetEstimatedMarginDetails';
import { Checkbox } from 'app/components/Checkbox';

interface ITradeDialogContentProps {
  onSubmit: () => void;
  orderType: OrderType;
  estimations: MarginDetails;
  simulatorStatus: SimulationStatus;
  simulatorError: Nullable<string>;
  entryPrice: string;
  liquidationPrice: string;
  minReturn: string;
}

export const TradeDialogContent: React.FC<ITradeDialogContentProps> = ({
  onSubmit,
  orderType,
  estimations,
  simulatorStatus,
  simulatorError,
  entryPrice,
  liquidationPrice,
  minReturn,
}) => {
  const { t } = useTranslation();
  const account = useAccount();
  const { checkMaintenance, States } = useMaintenance();
  const openTradesLocked = checkMaintenance(States.OPEN_MARGIN_TRADES);
  const { position, amount, pairType, collateral, leverage } = useSelector(
    selectMarginTradePage,
  );
  const pair = useMemo(() => TradingPairDictionary.get(pairType), [pairType]);

  const {
    loanToken,
    collateralToken,
    useLoanTokens,
  } = useTrading_resolvePairTokens(pair, position, collateral);
  const contractName = getLendingContractName(loanToken);

  const txArgs = [
    HashZero, //0 if new loan
    toWei(String(leverage - 1), 'ether'),
    useLoanTokens ? amount : '0',
    useLoanTokens ? '0' : amount,
    getTokenContract(collateralToken).address,
    account, // trader
    minReturn,
    '0x',
  ];

  const txConf = {
    value: collateral === Asset.RBTC ? amount : '0',
  };

  const [ignoreError, setIgnoreError] = useState(false);
  const disableButtonAfterSimulatorError = useMemo(() => {
    return ignoreError ? false : simulatorStatus === SimulationStatus.FAILED;
  }, [ignoreError, simulatorStatus]);

  const handleIgnoreError = useCallback(() => setIgnoreError(!ignoreError), [
    ignoreError,
  ]);

  return (
    <div className="tw-w-auto md:tw-mx-7 tw-mx-2">
      <h1 className="tw-text-sov-white tw-text-center">
        {t(translations.marginTradePage.tradeDialog.title)}
      </h1>
      <TradeDialogInfo
        position={position}
        leverage={leverage}
        orderTypeValue={orderType}
        amount={amount}
        collateral={collateral}
        loanToken={loanToken}
        collateralToken={collateralToken}
        useLoanTokens={useLoanTokens}
      />
      <div className="tw-pt-3 tw-pb-2 tw-px-6 tw-bg-gray-2 tw-mb-4 tw-rounded-lg tw-text-sm tw-font-light">
        <TxFeeCalculator
          args={txArgs}
          txConfig={txConf}
          methodName="marginTrade"
          contractName={contractName}
          condition={true}
          textClassName={'tw-text-gray-10 tw-text-gray-10'}
        />
        <LabelValuePair
          label={t(translations.marginTradePage.tradeDialog.maintananceMargin)}
          value={<>{weiToNumberFormat(MAINTENANCE_MARGIN)} %</>}
          valueClassName="tw-text-right"
        />
        <LabelValuePair
          label={t(translations.marginTradePage.tradeDialog.interestAPR)}
          value={<>{weiToNumberFormat(estimations.interestRate, 2)} %</>}
          valueClassName="tw-text-right"
        />
      </div>

      <p className="tw-text-center tw-text-sm tw-mt-3 tw-mb-2">
        {t(translations.marginTradePage.tradeDialog.newPositionDetails)}
      </p>
      <div className="tw-pt-3 tw-pb-2 tw-px-6 tw-bg-gray-5 tw-mb-4 tw-rounded-lg tw-text-xs tw-font-light">
        <LabelValuePair
          label={t(translations.marginTradePage.tradeDialog.positionSize)}
          className={classNames({
            'tw-text-trade-short': position === TradingPosition.SHORT,
            'tw-text-trade-long': position === TradingPosition.LONG,
          })}
          value={
            <>
              {weiToAssetNumberFormat(estimations.collateral, collateralToken)}{' '}
              <AssetRenderer asset={collateralToken} />
            </>
          }
        />
        <LabelValuePair
          label={t(translations.marginTradePage.tradeDialog.margin)}
          value={
            <>
              {weiToAssetNumberFormat(amount, collateral)}{' '}
              <AssetRenderer asset={collateral} />
            </>
          }
        />
        <LabelValuePair
          label={t(translations.marginTradePage.tradeDialog.leverage)}
          value={toNumberFormat(leverage) + 'x'}
        />
        <LabelValuePair
          label={t(translations.marginTradePage.tradeDialog.entryPrice)}
          value={
            <>
              {useTenderlySimulator ? (
                <>
                  <LoadableValue
                    loading={simulatorStatus === SimulationStatus.PENDING}
                    value={
                      <>
                        {weiToAssetNumberFormat(entryPrice, pair.longAsset)}{' '}
                        <AssetRenderer asset={pair.longAsset} />
                      </>
                    }
                    tooltip={weiToNumberFormat(entryPrice, 18)}
                  />
                </>
              ) : (
                <>
                  <PricePrediction
                    position={position}
                    leverage={leverage}
                    loanToken={loanToken}
                    collateralToken={collateralToken}
                    useLoanTokens={useLoanTokens}
                    weiAmount={amount}
                    asset={pair.longAsset}
                  />{' '}
                  <AssetRenderer asset={pair.longAsset} />
                </>
              )}
            </>
          }
        />
        {useTenderlySimulator && (
          <LabelValuePair
            label={t(translations.marginTradePage.tradeDialog.liquidationPrice)}
            value={
              <>
                <LoadableValue
                  loading={simulatorStatus === SimulationStatus.PENDING}
                  tooltip={toNumberFormat(liquidationPrice, 18)}
                  value={
                    <>
                      {toAssetNumberFormat(liquidationPrice, pair.longAsset)}{' '}
                      <AssetRenderer asset={pair.longAsset} />
                    </>
                  }
                />
              </>
            }
          />
        )}
      </div>

      <div className="tw-mt-4">
        {openTradesLocked && (
          <ErrorBadge
            content={
              <Trans
                i18nKey={translations.maintenance.openMarginTrades}
                components={[
                  <a
                    href={discordInvite}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="tw-text-warning tw-text-xs tw-underline hover:tw-no-underline"
                  >
                    x
                  </a>,
                ]}
              />
            }
          />
        )}

        {useTenderlySimulator && simulatorStatus === SimulationStatus.FAILED && (
          <>
            <ErrorBadge
              content={t(
                translations.marginTradePage.tradeDialog.estimationErrorNote,
                { error: simulatorError },
              )}
            />
            <Checkbox
              checked={ignoreError}
              onChange={handleIgnoreError}
              label={t(translations.common.continueToFailure)}
              data-action-id="accept-terms-checkbox"
            />
          </>
        )}
      </div>

      <div className="tw-mw-340 tw-mx-auto">
        <DialogButton
          confirmLabel={t(translations.common.confirm)}
          onConfirm={onSubmit}
          disabled={openTradesLocked || disableButtonAfterSimulatorError}
          data-action-id="margin-reviewTransaction-button-confirm"
        />
      </div>
    </div>
  );
};
