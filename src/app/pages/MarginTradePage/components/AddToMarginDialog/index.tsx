/**
 *
 * AddToMarginDialog
 *
 */
import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { AssetsDictionary } from '../../../../../utils/dictionaries/assets-dictionary';
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
import { TxFeeCalculator } from '../TxFeeCalculator';
import { AmountInput } from 'app/components/Form/AmountInput';
import { FormGroup } from 'app/components/Form/FormGroup';
import { DialogButton } from 'app/components/Form/DialogButton';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { ActiveLoan } from 'types/active-loan';
import { discordInvite } from 'utils/classifiers';
import { bignumber } from 'mathjs';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { formatNumber } from '../../../../containers/StatsPage/utils';
import { usePositionLiquidationPrice } from '../../../../hooks/trading/usePositionLiquidationPrice';
import { TradingPosition } from '../../../../../types/trading-position';

interface Props {
  item: ActiveLoan;
  showModal: boolean;
  onCloseModal: () => void;
  liquidationPrice?: React.ReactNode;
}

export function AddToMarginDialog(props: Props) {
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

  const isLong = useMemo(() => loanToken.asset === pair.longAsset, [
    loanToken.asset,
    pair.longAsset,
  ]);

  const liquidationPrice = usePositionLiquidationPrice(
    props.item.principal,
    bignumber(props.item.collateral).add(weiAmount).toString(),
    isLong ? TradingPosition.LONG : TradingPosition.SHORT,
    props.item.maintenanceMargin,
  );

  return (
    <>
      <Dialog isOpen={props.showModal} onClose={() => props.onCloseModal()}>
        <div className="tw-mw-340 tw-mx-auto">
          <h1 className="tw-mb-6 tw-text-sov-white tw-text-center">
            {t(translations.addToMargin.title)}
          </h1>
          <FormGroup
            label={t(translations.addToMargin.amount)}
            className="tw-mb-12"
          >
            <AmountInput
              onChange={value => setAmount(value)}
              value={amount}
              asset={tokenDetails.asset}
            />
          </FormGroup>
          <FormGroup label={t(translations.addToMargin.liquidationPrice)}>
            <DummyField>
              {formatNumber(Number(liquidationPrice), 4)}&nbsp;&nbsp;
              <AssetRenderer asset={pair.longDetails.asset} />
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

AddToMarginDialog.defaultProps = {
  item: {},
};
