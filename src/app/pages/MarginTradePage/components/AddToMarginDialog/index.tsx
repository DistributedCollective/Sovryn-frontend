/**
 *
 * AddToMarginDialog
 *
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { AssetsDictionary } from '../../../../../utils/dictionaries/assets-dictionary';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { useIsAmountWithinLimits } from '../../../../hooks/useIsAmountWithinLimits';
import { useApproveAndAddMargin } from '../../../../hooks/trading/useApproveAndAndMargin';
import { Dialog } from '../../../../containers/Dialog/Loadable';
import { useCanInteract } from '../../../../hooks/useCanInteract';
import { useMaintenance } from '../../../../hooks/useMaintenance';
import { AmountInput } from 'form/AmountInput';
import { FormGroup } from 'form/FormGroup';
import { TxFeeCalculator } from '../TxFeeCalculator';
import { TxDialog } from '../../../../components/Dialogs/TxDialog';
import { DialogButton } from 'form/DialogButton';
import { ErrorBadge } from 'form/ErrorBadge';
import { LiquidationPrice } from '../LiquidationPrice';
import { DummyField } from '../../../../components/DummyField';
import { leverageFromMargin } from '../../../../../utils/blockchain/leverage-from-start-margin';
import { TradingPairDictionary } from '../../../../../utils/dictionaries/trading-pair-dictionary';
import { TradingPosition } from '../../../../../types/trading-position';
import type { ActiveLoan } from 'types/active-loan';
import { stringToFixedPrecision } from 'utils/display-text/format';

interface Props {
  item: ActiveLoan;
  showModal: boolean;
  onCloseModal: () => void;
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
  const { checkMaintenance } = useMaintenance();
  const topupLocked = checkMaintenance('openTradesSwaps');

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
        <div className="tw-mw-320 tw-mx-auto">
          <h1 className="tw-text-white tw-tracking-normal">
            {t(translations.addToMargin.title)}
          </h1>

          <FormGroup
            label={t(translations.addToMargin.amount)}
            className="tw-mb-8"
          >
            <AmountInput
              onChange={value => setAmount(value)}
              value={stringToFixedPrecision(amount, 6)}
              asset={tokenDetails.asset}
            />
          </FormGroup>

          <FormGroup label={t(translations.addToMargin.liquidationPrice)}>
            <DummyField>
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
            </DummyField>
          </FormGroup>

          <TxFeeCalculator
            args={[props.item.loanId, weiAmount]}
            methodName="depositCollateral"
            contractName="sovrynProtocol"
          />

          {topupLocked?.maintenance_active && (
            <ErrorBadge content={topupLocked?.message} />
          )}

          <DialogButton
            confirmLabel={t(translations.common.confirm)}
            onConfirm={() => handleConfirm()}
            disabled={
              topupLocked?.maintenance_active ||
              tx.loading ||
              !valid ||
              !canInteract
            }
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
