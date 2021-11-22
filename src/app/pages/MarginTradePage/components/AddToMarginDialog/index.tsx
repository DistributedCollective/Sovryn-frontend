import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import cn from 'classnames';
import { TradingPosition } from '../../../../../types/trading-position';
import { leverageFromMargin } from '../../../../../utils/blockchain/leverage-from-start-margin';
import { AssetsDictionary } from '../../../../../utils/dictionaries/assets-dictionary';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { TradingPairDictionary } from '../../../../../utils/dictionaries/trading-pair-dictionary';
import { TransactionDialog } from 'app/components/TransactionDialog';
import { DummyField } from '../../../../components/DummyField';
import { Dialog } from '../../../../containers/Dialog/Loadable';
import { useApproveAndAddMargin } from '../../../../hooks/trading/useApproveAndAndMargin';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { useCanInteract } from '../../../../hooks/useCanInteract';
import { useIsAmountWithinLimits } from '../../../../hooks/useIsAmountWithinLimits';
import { useMaintenance } from '../../../../hooks/useMaintenance';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { LiquidationPrice } from '../LiquidationPrice';
import { TxFeeCalculator } from '../TxFeeCalculator';
import { AmountInput } from 'app/components/Form/AmountInput';
import { FormGroup } from 'app/components/Form/FormGroup';
import { DialogButton } from 'app/components/Form/DialogButton';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import type { ActiveLoan } from 'types/active-loan';
import { discordInvite } from 'utils/classifiers';
import { LoadableValue } from 'app/components/LoadableValue';
import { weiToNumberFormat } from 'utils/display-text/format';
import { fromWei } from 'utils/blockchain/math-helpers';

interface IAddToMarginDialogProps {
  item: ActiveLoan;
  showModal: boolean;
  onCloseModal: () => void;
  liquidationPrice?: React.ReactNode;
  positionSize?: string;
}

export function AddToMarginDialog(props: IAddToMarginDialogProps) {
  const canInteract = useCanInteract();
  const tokenDetails = AssetsDictionary.getByTokenContractAddress(
    props.item?.collateralToken || '',
  );
  const loanToken = AssetsDictionary.getByTokenContractAddress(
    props.item?.loanToken || '',
  );
  const [amount, setAmount] = useState('');
  const { value: balance } = useAssetBalanceOf(tokenDetails.asset);
  const weiAmount = useWeiAmount(amount);

  const { send, ...tx } = useApproveAndAddMargin(
    tokenDetails.asset,
    props.item.loanId,
    weiAmount,
  );
  const { checkMaintenance, States } = useMaintenance();
  const topupLocked = checkMaintenance(States.ADD_TO_MARGIN_TRADES);

  const handleConfirm = () => {
    send();
  };

  const valid = useIsAmountWithinLimits(weiAmount, '1', balance);
  const { t } = useTranslation();

  const pair = TradingPairDictionary.findPair(
    loanToken.asset,
    tokenDetails.asset,
  );

  return (
    <>
      <Dialog isOpen={props.showModal} onClose={() => props.onCloseModal()}>
        <div className="tw-mw-340 tw-mx-auto">
          <h1 className="tw-text-sov-white tw-text-center">
            {t(translations.addToMargin.title)}
          </h1>

          <div className="tw-py-4 tw-px-4 tw-bg-gray-2 sm:tw--mx-11 tw-mb-4 tw-rounded-lg tw-text-sm tw-font-light">
            <LabelValuePair
              label={t(translations.marginTradePage.tradeDialog.pair)}
              value={pair.chartSymbol}
            />
            <LabelValuePair
              label={t(translations.marginTradePage.tradeDialog.leverage)}
              value={<>{leverageFromMargin(props.item.startMargin)}x</>}
              className={cn({
                'tw-text-trade-short': loanToken.asset !== pair.longAsset,
                'tw-text-trade-long': loanToken.asset === pair.longAsset,
              })}
            />
            <LabelValuePair
              label={t(translations.closeTradingPositionHandler.positionSize)}
              value={
                <>
                  <LoadableValue
                    loading={false}
                    value={weiToNumberFormat(props.item.collateral, 4)}
                    tooltip={fromWei(props.item.collateral)}
                  />{' '}
                  <AssetRenderer asset={tokenDetails.asset} />
                </>
              }
            />
          </div>

          <FormGroup
            label={t(translations.addToMargin.amount)}
            className="tw-mb-6"
          >
            <AmountInput
              onChange={value => setAmount(value)}
              value={amount}
              asset={tokenDetails.asset}
              showBalance={true}
            />
          </FormGroup>

          <FormGroup
            label={t(translations.addToMargin.liquidationPrice)}
            className="tw-mb-5"
          >
            <DummyField>
              {props.liquidationPrice || (
                <LiquidationPrice
                  asset={pair.shortAsset}
                  assetLong={pair.longAsset}
                  leverage={leverageFromMargin(props.item.startMargin)}
                  position={
                    loanToken.asset === pair.longAsset
                      ? TradingPosition.LONG
                      : TradingPosition.SHORT
                  }
                />
              )}
            </DummyField>
          </FormGroup>

          <div className="tw-text-sm tw-mb-3">
            <TxFeeCalculator
              args={[props.item.loanId, weiAmount]}
              methodName="depositCollateral"
              contractName="sovrynProtocol"
            />
          </div>

          {topupLocked && (
            <ErrorBadge
              content={
                <Trans
                  i18nKey={translations.maintenance.addToMarginTrades}
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
          <DialogButton
            confirmLabel={t(translations.common.confirm)}
            onConfirm={() => handleConfirm()}
            disabled={topupLocked || tx.loading || !valid || !canInteract}
            cancelLabel={t(translations.common.cancel)}
            onCancel={props.onCloseModal}
          />
        </div>
      </Dialog>
      <TransactionDialog
        fee={
          <TxFeeCalculator
            args={[props.item.loanId, weiAmount]}
            methodName="depositCollateral"
            contractName="sovrynProtocol"
          />
        }
        tx={tx}
        onUserConfirmed={() => props.onCloseModal()}
      />
    </>
  );
}

interface LabelValuePairProps {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
}

function LabelValuePair(props: LabelValuePairProps) {
  return (
    <div
      className={cn(
        'tw-flex tw-flex-row tw-mb-1 tw-justify-start tw-text-sov-white',
        props.className,
      )}
    >
      <div className="tw-w-1/2 tw-text-gray-10 sm:tw-ml-8 sm:tw-pl-2 tw-text-gray-10">
        {props.label}
      </div>
      <div className="tw-w-1/2 tw-font-medium">{props.value}</div>
    </div>
  );
}
