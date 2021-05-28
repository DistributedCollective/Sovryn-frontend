import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';

import { translations } from '../../../../../locales/i18n';
import { Dialog } from '../../../Dialog';
import { DialogButton } from 'form/DialogButton';
import { Asset } from 'types';
import { DialogType } from '../CurrencyContainer/CurrencyRow';
import { FormGroup } from 'form/FormGroup';
import { AmountInput } from 'form/AmountInput';
import { AvailableBalance } from 'app/components/AvailableBalance';

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
import { ArrowDown } from 'app/pages/BuySovPage/components/ArrowStep/down';
import { TxDialog } from 'app/components/Dialogs/TxDialog';
import { NextSupplyInterestRate } from 'app/components/NextSupplyInterestRate';
import { LoadableValue } from 'app/components/LoadableValue';
import { fromWei } from 'web3-utils';
import { weiToNumberFormat } from 'utils/display-text/format';
import { AssetRenderer } from 'app/components/AssetRenderer';

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
    translations.lending.modal[type === 'add' ? 'deposit' : 'withdraw'];
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

  const validate = useMemo(() => {
    return (
      bignumber(weiAmount).greaterThan(0) &&
      bignumber(weiAmount).lessThanOrEqualTo(
        maxMinusFee(userBalance, currency, gasLimit),
      )
    );
  }, [currency, userBalance, weiAmount]);

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

          <div className="tw-mb-6 tw-mt-2">
            {type === 'add' && <AvailableBalance asset={currency} />}

            {type === 'remove' && (
              <div className="tw-mb-8 tw-truncate tw-text-xs tw-font-light tw-tracking-normal">
                <Trans
                  i18nKey={translations.lending.modal.withdraw.depositBalance}
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
              <ArrowDown />
              <div className="tw-text-center tw-mb-4">
                APY{' '}
                <NextSupplyInterestRate
                  asset={currency}
                  weiAmount={lendingAmount}
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
            disabled={type === 'add' ? !valid : !validRedeem}
            className="tw-rounded-lg"
          />
        </div>
      </Dialog>
      <TxDialog tx={lendTx} onUserConfirmed={() => props.onCloseModal()} />
    </>
  );
}
