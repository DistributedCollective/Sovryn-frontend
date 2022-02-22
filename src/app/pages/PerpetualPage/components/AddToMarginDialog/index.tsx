import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import cn from 'classnames';
import { TradingPosition } from '../../../../../types/trading-position';
import { leverageFromMargin } from '../../../../../utils/blockchain/leverage-from-start-margin';
import { AssetsDictionary } from '../../../../../utils/dictionaries/assets-dictionary';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { TradingPairDictionary } from '../../../../../utils/dictionaries/trading-pair-dictionary';
import { TxDialog } from '../../../../components/Dialogs/TxDialog';
import { DummyField } from '../../../../components/DummyField';
import { Dialog } from '../../../../containers/Dialog/Loadable';
import { useApproveAndAddMargin } from '../../../../hooks/trading/useApproveAndAndMargin';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { useCanInteract } from '../../../../hooks/useCanInteract';
import { useIsAmountWithinLimits } from '../../../../hooks/useIsAmountWithinLimits';
import { useMaintenance } from '../../../../hooks/useMaintenance';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { LiquidationPrice } from '../LiquidationPrice';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import { AmountInput } from 'app/components/Form/AmountInput';
import { FormGroup } from 'app/components/Form/FormGroup';
import { DialogButton } from 'app/components/Form/DialogButton';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import type { ActiveLoan } from 'types/active-loan';
import { discordInvite } from 'utils/classifiers';

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
  const topupLocked = true;

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

          <div className="tw-py-4 tw-px-4 tw-bg-gray-2 sm:tw--mx-11 tw-mb-6 tw-rounded-lg tw-text-xs">
            <div className="tw-flex tw-flex-row tw-mb-1 tw-justify-center">
              <div className="sm:tw-w-1/3 tw-w-1/2 tw-text-gray-10 sm:tw-ml-12">
                {t(translations.perpetualPage.tradeDialog.pair)}
              </div>
              <div className="tw-text-sov-white tw-ml-6 tw-w-1/3">
                {pair.chartSymbol}
              </div>
            </div>
            <div className="tw-flex tw-flex-row tw-mb-1 tw-justify-center">
              <div className="sm:tw-w-1/3 tw-w-1/2 tw-text-gray-10 sm:tw-ml-12">
                {t(translations.perpetualPage.tradeDialog.leverage)}
              </div>
              <div
                className={cn('tw-text-sov-white tw-ml-6 tw-w-1/3', {
                  'tw-text-trade-short': loanToken.asset !== pair.longAsset,
                  'tw-text-trade-long': loanToken.asset === pair.longAsset,
                })}
              >
                {leverageFromMargin(props.item.startMargin)}x
              </div>
            </div>
            <div className="tw-flex tw-flex-row tw-justify-center">
              <div className="sm:tw-w-1/3 tw-w-1/2 tw-text-gray-10 sm:tw-ml-12">
                {t(translations.perpetualPage.tradeDialog.positionSize)}
              </div>
              <div className="tw-text-sov-white tw-ml-6 tw-w-1/3">
                {props.positionSize}{' '}
                <AssetRenderer asset={tokenDetails.asset} />
              </div>
            </div>
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

          <TxFeeCalculator
            args={[props.item.loanId, weiAmount]}
            methodName="depositCollateral"
            contractName="sovrynProtocol"
          />

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
      <TxDialog tx={tx} onUserConfirmed={() => props.onCloseModal()} />
    </>
  );
}
