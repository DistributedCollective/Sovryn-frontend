import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';

import { translations } from 'locales/i18n';
import { DialogButton } from 'app/components/Form/DialogButton';
import { Asset } from 'types';
import { DialogType } from '../../types';
import { FormGroup } from 'app/components/Form/FormGroup';
import { AmountInput } from 'app/components/Form/AmountInput';

import { useAssetBalanceOf } from 'app/hooks/useAssetBalanceOf';
import { useLending_balanceOf } from 'app/hooks/lending/useLending_balanceOf';
import { useLending_approveAndLend } from 'app/hooks/lending/useLending_approveAndLend';
import { useLending_approveAndUnlend } from 'app/hooks/lending/useLending_approveAndUnlend';
import { useLending_transactionLimit } from 'app/hooks/lending/useLending_transactionLimit';
import { useIsAmountWithinLimits } from 'app/hooks/useIsAmountWithinLimits';
import { useAccount } from 'app/hooks/useAccount';
import { useWeiAmount } from 'app/hooks/useWeiAmount';
import { bignumber } from 'mathjs';
import { maxMinusFee } from 'utils/helpers';
import { useLending_assetBalanceOf } from 'app/hooks/lending/useLending_assetBalanceOf';
import { NextSupplyInterestRate } from 'app/components/NextSupplyInterestRate';
import { LoadableValue } from 'app/components/LoadableValue';
import { fromWei } from 'web3-utils';
import { weiToNumberFormat } from 'utils/display-text/format';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Dialog } from 'app/containers/Dialog';
import classNames from 'classnames';
import {
  getLendingContractName,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';
import { TxFeeCalculator } from 'app/pages/MarginTradePage/components/TxFeeCalculator';
import { LendingPoolDictionary } from 'utils/dictionaries/lending-pool-dictionary';
import { TransactionDialog } from 'app/components/TransactionDialog';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';

interface ILendingDialogProps {
  currency: Asset;
  showModal: boolean;
  onCloseModal: () => void;
  type: DialogType;
  lendingAmount: string;
}

const gasLimit = 340000;

export const LendingDialog: React.FC<ILendingDialogProps> = ({
  currency,
  type,
  lendingAmount,
  ...props
}) => {
  const { t } = useTranslation();
  const modalTranslation =
    translations.lendingPage.modal[
      type === DialogType.ADD ? 'deposit' : 'withdraw'
    ];
  const [amount, setAmount] = useState<string>('');
  const lendingContract = getLendingContractName(currency);
  const { value: marketLiquidity } = useCacheCallWithValue(
    lendingContract,
    'marketLiquidity',
    '0',
  );

  const weiAmount = useWeiAmount(amount);

  const { value: userBalance } = useAssetBalanceOf(currency);
  const { value: depositedBalance } = useLending_balanceOf(
    currency,
    useAccount(),
  );
  const {
    value: depositedAssetBalance,
    loading: loadingDepositedAssetBalance,
  } = useLending_assetBalanceOf(currency, useAccount());
  const { value: maxAmount } = useLending_transactionLimit(currency, currency);

  const isGreaterThanZero = useMemo(() => bignumber(weiAmount).greaterThan(0), [
    weiAmount,
  ]);

  const hasSufficientBalance = useMemo(
    () =>
      bignumber(weiAmount).lessThanOrEqualTo(
        maxMinusFee(userBalance, currency, gasLimit),
      ),
    [currency, userBalance, weiAmount],
  );

  const validate = useMemo(() => isGreaterThanZero && hasSufficientBalance, [
    isGreaterThanZero,
    hasSufficientBalance,
  ]);
  const [isTotalClicked, setIsTotalClicked] = useState<boolean | undefined>();

  const calculateWithdrawAmount = useCallback(() => {
    let withdrawAmount = weiAmount;
    //checking, if user want to withdraw full amount, this will update it
    if (isTotalClicked) {
      withdrawAmount = depositedAssetBalance;
    }
    if (bignumber(marketLiquidity).lessThanOrEqualTo(withdrawAmount)) {
      withdrawAmount = marketLiquidity;
    }

    return bignumber(withdrawAmount)
      .mul(bignumber(depositedBalance).div(depositedAssetBalance))
      .toFixed(0);
  }, [
    depositedAssetBalance,
    depositedBalance,
    isTotalClicked,
    weiAmount,
    marketLiquidity,
  ]);

  const [withdrawAmount, setWithdrawAmount] = useState(
    calculateWithdrawAmount(),
  );

  const maxWithdrawAmount = useMemo(() => {
    if (bignumber(depositedAssetBalance).greaterThan(marketLiquidity)) {
      return marketLiquidity;
    } else {
      return depositedAssetBalance;
    }
  }, [depositedAssetBalance, marketLiquidity]);

  const validateRedeem = useMemo(
    () => bignumber(depositedAssetBalance).lessThan(marketLiquidity),
    [depositedAssetBalance, marketLiquidity],
  );

  useEffect(() => {
    setWithdrawAmount(calculateWithdrawAmount());
  }, [calculateWithdrawAmount]);

  // LENDING
  const { lend, ...lendTx } = useLending_approveAndLend(currency, weiAmount);
  const { unlend, ...unlendTx } = useLending_approveAndUnlend(
    currency,
    withdrawAmount,
  );

  const handleLendSubmit = useCallback(() => {
    if (!lendTx.loading) {
      lend();
    }
  }, [lendTx.loading, lend]);

  const handleUnlendSubmit = useCallback(() => {
    if (!unlendTx.loading) {
      unlend();
    }
  }, [unlendTx.loading, unlend]);

  const isValid =
    useIsAmountWithinLimits(
      weiAmount,
      '1',
      maxAmount !== '0' ? maxAmount : undefined,
    ) && validate;

  const isValidRedeem =
    useIsAmountWithinLimits(weiAmount, '1', depositedAssetBalance) &&
    validateRedeem;

  // reset amount to if currency was changed
  useEffect(() => {
    setAmount('');
  }, [currency]);

  const disabled = () => (type === DialogType.ADD ? !isValid : !isValidRedeem);

  const errorMessage = useMemo(() => {
    if (type === DialogType.ADD) {
      if (!isGreaterThanZero)
        return t(translations.validationErrors.minimumZero);
      if (!hasSufficientBalance)
        return t(translations.validationErrors.insufficientBalance);
    }
  }, [type, isGreaterThanZero, t, hasSufficientBalance]);

  const contractName = getLendingContractName(currency);
  const tokenAddress = getTokenContract(currency).address;
  const { useLM } = LendingPoolDictionary.get(currency);

  const getMethodName = useCallback(() => {
    if (type === DialogType.ADD) {
      return currency === Asset.RBTC ? 'mintWithBTC' : 'mint';
    }
    return currency === Asset.RBTC ? 'burnToBTC' : 'burn';
  }, [type, currency]);

  const txFeeArgs = useMemo(() => {
    if (type === DialogType.ADD)
      return currency === Asset.RBTC
        ? [tokenAddress, useLM]
        : [tokenAddress, weiAmount, useLM];
    return [tokenAddress, withdrawAmount, useLM];
  }, [currency, tokenAddress, type, useLM, weiAmount, withdrawAmount]);

  const handleSubmit = () =>
    type === DialogType.ADD ? handleLendSubmit() : handleUnlendSubmit();

  const handleChange = useCallback((newValue: string, isTotal?: boolean) => {
    setAmount(newValue);
    setIsTotalClicked(isTotal);
  }, []);

  const maxDepositText =
    Number(maxAmount) > 0
      ? ` ${t(translations.lendingPage.modal.deposit.max, {
          limit: weiToNumberFormat(maxAmount, 4),
          asset: currency,
        })}`
      : '';

  return (
    <>
      <Dialog isOpen={props.showModal} onClose={() => props.onCloseModal()}>
        <div className="tw-mw-340 tw-mx-auto">
          <h1 className="tw-text-sov-white tw-text-center tw-tracking-normal">
            {t(modalTranslation.title)}
          </h1>
          <FormGroup
            label={
              type === DialogType.ADD
                ? `${t(
                    translations.lendingPage.modal.deposit.amount,
                  )}${maxDepositText}:`
                : t(translations.lendingPage.modal.withdraw.amount)
            }
          >
            <AmountInput
              value={amount}
              onChange={(value, isTotal) => handleChange(value, isTotal)}
              asset={currency}
              maxAmount={
                type === DialogType.ADD
                  ? maxMinusFee(userBalance, currency, gasLimit)
                  : maxWithdrawAmount
              }
              dataActionId={`lend-${
                type === DialogType.ADD ? 'deposit' : 'withdraw'
              }`}
            />
          </FormGroup>

          <div className="tw-mb-4 tw-mt-2">
            {type === DialogType.ADD && (
              <div
                className={classNames(
                  'tw-text-warning tw-text-sm tw-text-center',
                  {
                    'tw-invisible tw-py-2 tw-mb-2': !errorMessage,
                  },
                )}
              >
                {errorMessage}
              </div>
            )}

            {type === DialogType.REMOVE && (
              <div className="tw-mb-10 tw-truncate tw-text-xs tw-font-normal tw-tracking-normal">
                <Trans
                  i18nKey={
                    translations.lendingPage.modal.withdraw.depositBalance
                  }
                  components={[
                    <LoadableValue
                      value={weiToNumberFormat(depositedAssetBalance, 6)}
                      loading={loadingDepositedAssetBalance}
                      tooltip={
                        <>
                          {fromWei(depositedAssetBalance)}{' '}
                          <AssetRenderer asset={currency} />
                        </>
                      }
                    />,
                  ]}
                />
              </div>
            )}
          </div>

          {type === DialogType.ADD && (
            <>
              <div
                className={classNames('tw-text-center tw-mt-8 tw-mb-12', {
                  'tw-opacity-40': disabled(),
                })}
              >
                <Trans
                  i18nKey={translations.lendingPage.modal.deposit.apy}
                  components={[
                    <NextSupplyInterestRate
                      asset={currency}
                      weiAmount={lendingAmount}
                    />,
                  ]}
                />
              </div>
            </>
          )}
          <TxFeeCalculator
            args={txFeeArgs}
            methodName={getMethodName()}
            contractName={contractName}
            className="tw-mt-6"
          />
          <DialogButton
            confirmLabel={t(modalTranslation.cta)}
            onConfirm={handleSubmit}
            disabled={disabled()}
            className="tw-rounded-lg"
            data-action-id={`lend-${
              type === DialogType.ADD ? 'deposit' : 'withdraw'
            }-confirmButton-${currency}`}
          />
        </div>
      </Dialog>
      {type === DialogType.ADD && <TransactionDialog tx={lendTx} />}
      {type === DialogType.REMOVE && <TransactionDialog tx={unlendTx} />}
    </>
  );
};
