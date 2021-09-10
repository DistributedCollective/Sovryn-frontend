import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { AssetsDictionary } from '../../../../../utils/dictionaries/assets-dictionary';
import { TxDialog } from '../../../../components/Dialogs/TxDialog';
import { Dialog } from '../../../../containers/Dialog/Loadable';
import { useAssetBalanceOf } from '../../../../hooks/useAssetBalanceOf';
import { useCanInteract } from '../../../../hooks/useCanInteract';
import { useIsAmountWithinLimits } from '../../../../hooks/useIsAmountWithinLimits';
import { useMaintenance } from '../../../../hooks/useMaintenance';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import { AmountInput } from 'app/components/Form/AmountInput';
import { FormGroup } from 'app/components/Form/FormGroup';
import { DialogButton } from 'app/components/Form/DialogButton';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import type { ActiveLoan } from 'types/active-loan';
import { discordInvite } from 'utils/classifiers';
import { useDispatch, useSelector } from 'react-redux';
import { selectLendBorrowSovryn } from '../../selectors';
import { useBlockSync } from '../../../../hooks/useAccount';
import { useGetLoan } from '../../../../hooks/trading/useGetLoan';
import { actions } from '../../slice';
import { ResetTxResponseInterface } from '../../../../hooks/useSendContractTx';
import { TxStatus } from '../../../../../store/global/transactions-store/types';

// FIXME: implement increase loan collateral hook;
const PLACEHOLDER: ResetTxResponseInterface & { send: () => void } = {
  send: () => {
    const warning = 'LOAN INCREASE COLLATERAL NOT IMPLEMENTED!';
    console.warn(warning);
    window.alert(warning);
  },
  loading: false,
  reset: () => undefined,
  status: TxStatus.NONE,
  txData: null,
  txHash: 'NOT IMPLEMENTED',
};

export const DepositCollateralHandler: React.FC<{}> = () => {
  const { depositCollateralItem, depositCollateralModalOpen } = useSelector(
    selectLendBorrowSovryn,
  );
  const dispatch = useDispatch();
  const blockSync = useBlockSync();

  const { value: loan, loading: loanLoading, getLoan } = useGetLoan();

  useEffect(() => {
    if (depositCollateralItem) {
      getLoan(depositCollateralItem);
    }
  }, [depositCollateralItem, getLoan, blockSync]);

  const { send, ...tx } = PLACEHOLDER;

  const onConfirm = useCallback(() => send(), [send]);

  const onClose = useCallback(
    () => dispatch(actions.closeDepositCollateral()),
    [dispatch],
  );

  return (
    <>
      <Dialog isOpen={depositCollateralModalOpen} onClose={onClose}>
        {loan && (
          <IncreaseCollateralForm
            loan={loan}
            tx={tx}
            onConfirm={onConfirm}
            onClose={onClose}
          />
        )}
      </Dialog>
      <TxDialog tx={tx} onUserConfirmed={onClose} />
    </>
  );
};

type IDepositCollateralFormProps = {
  loan: ActiveLoan;
  tx?: ResetTxResponseInterface;
  onConfirm: () => void;
  onClose: () => void;
};

const IncreaseCollateralForm: React.FC<IDepositCollateralFormProps> = ({
  tx,
  loan,
  onConfirm,
  onClose,
}) => {
  const { t } = useTranslation();
  const canInteract = useCanInteract();
  const { checkMaintenance, States } = useMaintenance();
  const isInMaintenance = checkMaintenance(States.DEPOSIT_COLLATERAL_BORROW);

  const [amount, setAmount] = useState('');
  const onAmountChange = useCallback(value => setAmount(value), []);

  const collateralToken = AssetsDictionary.getByTokenContractAddress(
    loan.collateralToken,
  );

  const { value: balance } = useAssetBalanceOf(collateralToken?.asset);
  const weiAmount = useWeiAmount(amount);
  const valid = useIsAmountWithinLimits(weiAmount, '1', balance);

  return (
    <div className="tw-mw-340 tw-mx-auto">
      <h1 className="tw-mb-6 tw-text-sov-white tw-text-center">
        {t(translations.depositCollateralBorrowForm.title)}
      </h1>

      <FormGroup
        label={t(translations.depositCollateralBorrowForm.labels.amount)}
        className="tw-mb-12"
      >
        <AmountInput
          onChange={onAmountChange}
          value={amount}
          asset={collateralToken.asset}
        />
      </FormGroup>

      <TxFeeCalculator
        args={[loan?.loanId, weiAmount]}
        methodName="depositCollateral"
        contractName="sovrynProtocol"
      />

      {isInMaintenance && (
        <ErrorBadge
          content={
            <Trans
              i18nKey={translations.maintenance.depositCollateralBorrow}
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
        onConfirm={onConfirm}
        disabled={isInMaintenance || tx?.loading || !valid || !canInteract}
        cancelLabel={t(translations.common.cancel)}
        onCancel={onClose}
      />
    </div>
  );
};
