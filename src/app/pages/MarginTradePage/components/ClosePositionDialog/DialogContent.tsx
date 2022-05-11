import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { AmountInput } from 'app/components/Form/AmountInput';
import { DialogButton } from 'app/components/Form/DialogButton';
import { FormGroup } from 'app/components/Form/FormGroup';

import { translations } from '../../../../../locales/i18n';
import { assetByTokenAddress } from '../../../../../utils/blockchain/contract-helpers';
import { useCloseWithSwap } from '../../../../hooks/protocol/useCloseWithSwap';
import { useAccount } from '../../../../hooks/useAccount';
import { useIsAmountWithinLimits } from '../../../../hooks/useIsAmountWithinLimits';
import { useMaintenance } from '../../../../hooks/useMaintenance';
import { useWeiAmount } from '../../../../hooks/useWeiAmount';
import { CollateralAssets } from '../CollateralAssets';

import { ActiveLoan } from 'types/active-loan';
import { TxFeeCalculator } from '../TxFeeCalculator';
import { weiToAssetNumberFormat } from '../../../../../utils/display-text/format';
import { DummyInput } from '../../../../components/Form/Input';
import { AssetSymbolRenderer } from '../../../../components/AssetSymbolRenderer';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { TransactionDialog } from 'app/components/TransactionDialog';

interface IDialogContentProps {
  item: ActiveLoan;
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

export function DialogContent(props: IDialogContentProps) {
  const receiver = useAccount();

  const [amount, setAmount] = useState('');
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

  const handleConfirmSwap = useCallback(() => send(), [send]);

  const valid = useIsAmountWithinLimits(weiAmount, '1', props.item.collateral);

  const { t } = useTranslation();

  const { checkMaintenance, States } = useMaintenance();
  const closeTradesLocked = checkMaintenance(States.CLOSE_MARGIN_TRADES);

  const args = useMemo(
    () => [props.item.loanId, receiver, weiAmount, isCollateral, '0x'],
    [props.item.loanId, receiver, weiAmount, isCollateral],
  );

  const { value, loading, error } = useCacheCallWithValue<{
    withdrawAmount: string;
    withdrawToken: string;
  }>(
    'sovrynProtocol',
    'closeWithSwap',
    { withdrawAmount: '0', withdrawToken: '' },
    ...args,
  );

  const token = useMemo(
    () => assetByTokenAddress(value.withdrawToken) || collateral,
    [collateral, value.withdrawToken],
  );

  return (
    <>
      <div className="tw-mw-340 tw-mx-auto">
        <h1 className="tw-mb-6 tw-text-sov-white tw-text-center tw-tracking-normal">
          {t(translations.closeTradingPositionHandler.title)}
        </h1>

        <FormGroup
          label={t(translations.closeTradingPositionHandler.amountToClose)}
          className="tw-mt-7"
        >
          <AmountInput
            onChange={value => setAmount(value)}
            value={amount}
            maxAmount={props.item.collateral}
          />
        </FormGroup>

        <CollateralAssets
          label={t(translations.closeTradingPositionHandler.withdrawIn)}
          value={collateral}
          onChange={setCollateral}
          options={options}
        />

        {value && (
          <FormGroup
            label={t(translations.closeTradingPositionHandler.withdrawAmount)}
          >
            <DummyInput
              value={weiToAssetNumberFormat(value.withdrawAmount, token)}
              appendElem={<AssetSymbolRenderer asset={token} />}
            />
          </FormGroup>
        )}

        <TxFeeCalculator
          args={args}
          methodName="closeWithSwap"
          contractName="sovrynProtocol"
        />

        {weiAmount !== '0' && error && <ErrorBadge content={error} />}

        <DialogButton
          confirmLabel={t(translations.common.confirm)}
          onConfirm={handleConfirmSwap}
          disabled={rest.loading || !valid || closeTradesLocked || loading}
        />
      </div>
      <TransactionDialog tx={rest} onClose={props.onCloseModal} />
    </>
  );
}
