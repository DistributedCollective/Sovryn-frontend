/**
 *
 * ClosePositionDialog
 *
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { useCloseWithSwap } from '../../../../hooks/protocol/useCloseWithSwap';
import { useAccount } from '../../../../hooks/useAccount';
import { assetByTokenAddress } from '../../../../../utils/blockchain/contract-helpers';
import { useIsAmountWithinLimits } from '../../../../hooks/useIsAmountWithinLimits';
import { Dialog } from '../../../../containers/Dialog/Loadable';
import { useTrading_testRates } from '../../../../hooks/trading/useTrading_testRates';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { useMaintenance } from '../../../../hooks/useMaintenance';
import { CollateralAssets } from '../CollateralAssets';
import { FormGroup } from 'form/FormGroup';
import { AmountInput } from 'form/AmountInput';
import { TxDialog } from '../../../../components/Dialogs/TxDialog';
import { DialogButton } from 'form/DialogButton';
import { ErrorBadge } from 'form/ErrorBadge';
import type { ActiveLoan } from 'types/active-loan';
import { TxFeeCalculator } from '../TxFeeCalculator';

interface Props {
  item: ActiveLoan;
  showModal: boolean;
  onCloseModal: () => void;
}

const getOptions = (item: ActiveLoan) => {
  if (!item.collateralToken || !item.loanToken) {
    return [];
  }
  return [
    assetByTokenAddress(item.collateralToken),
    assetByTokenAddress(item.loanToken),
  ];
};

export function ClosePositionDialog(props: Props) {
  const receiver = useAccount();

  const [amount, setAmount] = useState<string>('');
  const [collateral, setCollateral] = useState(
    assetByTokenAddress(props.item.collateralToken),
  );

  useEffect(() => {
    setAmount('');
  }, [props.item.collateral]);

  const options = useMemo(() => getOptions(props.item), [props.item]);
  const isCollateral = useMemo(
    () => collateral === assetByTokenAddress(props.item.collateralToken),
    [collateral, props.item.collateralToken],
  );

  const weiAmount = useWeiAmount(amount);

  const { send, ...rest } = useCloseWithSwap(
    props.item.loanId,
    receiver,
    weiAmount,
    isCollateral,
    '0x',
  );

  const handleConfirmSwap = () => {
    send();
  };

  const valid = useIsAmountWithinLimits(weiAmount, '1', props.item.collateral);

  const { t } = useTranslation();
  const test = useTrading_testRates(
    assetByTokenAddress(
      isCollateral ? props.item.loanToken : props.item.collateralToken,
    ),
    assetByTokenAddress(
      isCollateral ? props.item.collateralToken : props.item.loanToken,
    ),
    weiAmount,
  );

  const { checkMaintenance } = useMaintenance();
  const closeTradesLocked = checkMaintenance('closeTradesSwaps');

  const args = [props.item.loanId, receiver, weiAmount, isCollateral, '0x'];

  return (
    <>
      <Dialog isOpen={props.showModal} onClose={() => props.onCloseModal()}>
        <div className="tw-w-full tw-mw-320 tw-mx-auto">
          <h1 className="tw-mb-6 tw-text-white tw-text-center">
            {t(translations.closeTradingPositionHandler.title)}
          </h1>

          <CollateralAssets
            label={t(translations.closeTradingPositionHandler.withdrawIn)}
            value={collateral}
            onChange={value => setCollateral(value)}
            options={options}
          />

          <FormGroup label="Position amount to close" className="tw-mt-6">
            <AmountInput
              onChange={value => setAmount(value)}
              value={amount}
              maxAmount={props.item.collateral}
            />
          </FormGroup>

          <TxFeeCalculator
            args={args}
            methodName="closeWithSwap"
            contractName="sovrynProtocol"
          />

          {(closeTradesLocked?.maintenance_active || test.diff > 5) && (
            <ErrorBadge
              content={
                closeTradesLocked?.maintenance_active ? (
                  closeTradesLocked?.message
                ) : test.diff > 5 ? (
                  <>
                    <p className="tw-mb-1">
                      {t(
                        translations.closeTradingPositionHandler.liquidity
                          .line_1,
                      )}
                    </p>
                    <p className="tw-mb-0">
                      {t(
                        translations.closeTradingPositionHandler.liquidity
                          .line_2,
                      )}
                    </p>
                  </>
                ) : undefined
              }
            />
          )}
        </div>

        <div className="tw-full tw-px-5 tw-mt-8">
          <DialogButton
            confirmLabel={t(translations.common.confirm)}
            onConfirm={() => handleConfirmSwap()}
            disabled={
              rest.loading ||
              !valid ||
              closeTradesLocked?.maintenance_active ||
              test.diff > 5
            }
            cancelLabel={t(translations.common.cancel)}
            onCancel={props.onCloseModal}
          />
        </div>
      </Dialog>
      <TxDialog tx={rest} onUserConfirmed={() => props.onCloseModal()} />
    </>
  );
}

ClosePositionDialog.defaultProps = {
  item: {
    collateral: '0',
  },
};
