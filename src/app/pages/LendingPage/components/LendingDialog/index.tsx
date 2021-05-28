import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';

import { translations } from '../../../../../locales/i18n';
import { DialogButton } from 'form/DialogButton';
import { Asset } from 'types';
import { DialogType } from '../CurrencyContainer/CurrencyRow';
import { FormGroup } from 'form/FormGroup';
import { AmountInput } from 'form/AmountInput';

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
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import { NextSupplyInterestRate } from 'app/components/NextSupplyInterestRate';
import { LoadableValue } from 'app/components/LoadableValue';
import { fromWei } from 'web3-utils';
import { weiToNumberFormat } from 'utils/display-text/format';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { Dialog } from 'app/containers/Dialog';
import cn from 'classnames';

interface Props {
  currency: Asset;
  showModal: boolean;
  onCloseModal: () => void;
  type: DialogType;
  lendingAmount: string;
}

const gasLimit = 340000;

export function LendingDialog({
  currency,
  type,
  lendingAmount,
  ...props
}: Props) {
  const { t } = useTranslation();
  const modalTranslation =
    translations.lendingPage.modal[type === 'add' ? 'deposit' : 'withdraw'];
  const [amount, setAmount] = useState<string>('');
  // const isConnected = useIsConnected();

  const weiAmount = useWeiAmount(amount);

  const { value: userBalance } = useAssetBalanceOf(currency as Asset);
  const { value: depositedBalance } = useLending_balanceOf(
    currency as Asset,
    useAccount(),
  );
  const {
    value: depositedAssetBalance,
    loading: loadingDepositedAssetBalance,
  } = useLending_assetBalanceOf(currency as Asset, useAccount());
  const { value: maxAmount } = useLending_transactionLimit(currency, currency);

  const greaterZero = useMemo(() => {
    return bignumber(weiAmount).greaterThan(0);
  }, [weiAmount]);

  const enoughBalance = useMemo(() => {
    return bignumber(weiAmount).lessThanOrEqualTo(
      maxMinusFee(userBalance, currency, gasLimit),
    );
  }, [currency, userBalance, weiAmount]);

  const validate = useMemo(() => {
    return greaterZero && enoughBalance;
  }, [greaterZero, enoughBalance]);

  const withdrawAmount = useMemo(() => {
    return bignumber(weiAmount)
      .mul(bignumber(depositedBalance).div(depositedAssetBalance))
      .toFixed(0);
  }, [weiAmount, depositedBalance, depositedAssetBalance]);

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

  const valid =
    useIsAmountWithinLimits(
      weiAmount,
      '1',
      maxAmount !== '0' ? maxAmount : undefined,
    ) && validate;

  const validRedeem = useIsAmountWithinLimits(
    weiAmount,
    '1',
    depositedAssetBalance,
  );

  // reset amount to if currency was changed
  useEffect(() => {
    setAmount('');
  }, [currency]);

  const disabled = () => (type === 'add' ? !valid : !validRedeem);

  const errorMessage = useMemo(() => {
    if (type === 'add') {
      if (!greaterZero) return t(translations.validationErrors.minimumZero);
      if (!enoughBalance)
        return t(translations.validationErrors.insufficientBalance);
    }
  }, [type, greaterZero, t, enoughBalance]);

  return (
    <>
      <Dialog isOpen={props.showModal} onClose={() => props.onCloseModal()}>
        <div className="tw-mw-320 tw-mx-auto">
          <h1 className="tw-text-white tw-text-center tw-tracking-normal">
            {t(modalTranslation.title)}
          </h1>

          <FormGroup
            label={t(translations.marginTradePage.tradeForm.labels.amount)}
          >
            <AmountInput
              value={amount}
              onChange={value => setAmount(value)}
              asset={currency}
              maxAmount={type === 'add' ? userBalance : depositedAssetBalance}
            />
          </FormGroup>

          <div className="tw-mb-4 tw-mt-2">
            {/* {type === 'add' && <AvailableBalance asset={currency} />} */}

            {type === 'add' && (
              <div
                className={cn('tw-text-red tw-text-sm tw-text-center', {
                  'tw-invisible tw-py-2 tw-mb-2': !errorMessage,
                })}
              >
                {errorMessage}
              </div>
            )}

            {type === 'remove' && (
              <div className="tw-mb-10 tw-truncate tw-text-xs tw-font-light tw-tracking-normal">
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

          {type === 'add' && (
            <>
              <div
                className={cn('tw-text-center tw-mt-4 tw-mb-8', {
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

          {/*<FormGroup label="Expected Reward:" className="tw-mb-5">*/}
          {/*  <Input*/}
          {/*    value="0"*/}
          {/*    readOnly*/}
          {/*    appendElem={<AssetRenderer asset={Asset.SOV} />}*/}
          {/*  />*/}
          {/*</FormGroup>*/}

          {/* <TxFeeCalculator
            args={txFeeArgs}
            methodName="addLiquidityToV2"
            contractName="BTCWrapperProxy"
            className="tw-mt-6"
          /> */}

          {/*{topupLocked?.maintenance_active && (*/}
          {/*  <ErrorBadge content={topupLocked?.message} />*/}
          {/*)}*/}

          <DialogButton
            confirmLabel={t(modalTranslation.cta)}
            onConfirm={() => {
              if (type === 'add') handleLendSubmit();
              else handleUnlendSubmit();
            }}
            disabled={disabled()}
            className="tw-rounded-lg"
          />
        </div>
      </Dialog>
      <TxDialog tx={lendTx} onUserConfirmed={() => props.onCloseModal()} />
    </>
  );
}
