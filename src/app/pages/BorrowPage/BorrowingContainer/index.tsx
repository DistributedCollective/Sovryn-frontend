import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import {
  Popover,
  PopoverInteractionKind,
  Position,
  NumericInput,
} from '@blueprintjs/core';
import { useAssetBalanceOf } from '../../../hooks/useAssetBalanceOf';
import { useWeiAmount } from '../../../hooks/useWeiAmount';
import { useApproveAndBorrow } from '../../../hooks/trading/useApproveAndBorrow';
import { useIsAmountWithinLimits } from '../../../hooks/useIsAmountWithinLimits';
import styles from '../index.module.scss';
import { Asset } from '../../../../types';
import { AssetsDictionary } from '../../../../utils/dictionaries/assets-dictionary';
import { FormSelect } from '../../../components/FormSelect';
import { FieldGroup } from '../../../components/FieldGroup';
import { AssetWalletBalance } from '../../../components/AssetWalletBalance';
import { DummyField } from '../../../components/DummyField/Loadable';
import { weiTo4, weiToFixed } from '../../../../utils/blockchain/math-helpers';
import { TradeButton } from '../../../components/TradeButton';
import { SendTxProgress } from '../../../components/SendTxProgress';
import { bignumber, min } from 'mathjs';
import { actions } from '../slice';
import { useCanInteract } from '../../../hooks/useCanInteract';
import { useLending_transactionLimit } from '../../../hooks/lending/useLending_transactionLimit';
import { LendingPoolDictionary } from '../../../../utils/dictionaries/lending-pool-dictionary';
import { useLending_testAvailableSupply } from '../../../hooks/lending/useLending_testAvailableSupply';
import { useMaintenance } from '../../../hooks/useMaintenance';
import { useLending_getDepositAmountForBorrow } from '../../../hooks/lending/useLending_getDepositAmountForBorrow';
import { AmountField } from 'app/containers/AmountField';
import { TxStatus } from 'store/global/transactions-store/types';

type Props = {
  currency: Asset;
};

const BorrowingContainer: React.FC<Props> = ({ currency }) => {
  const { t } = useTranslation();
  const supportsBorrowing = useMemo(
    () => LendingPoolDictionary.get(currency).getBorrowCollateral().length > 0,
    [currency],
  );

  return (
    <>
      {supportsBorrowing ? (
        <InnerBorrowContainer currency={currency} />
      ) : (
        <>{t(translations.lend.borrowingContainer.disabled)}</>
      )}
    </>
  );
};

export default BorrowingContainer;

const InnerBorrowContainer: React.FC<Props> = ({ currency }) => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState<string>('');
  const [borrowDays, setBorrowDays] = useState(28); // by default 28 days
  const [borrowDaysPopup, setBorrowDaysPopup] = useState(false);
  const [isShowedBorrowDays] = useState(false);
  const isConnected = useCanInteract();
  const borrowAmount = useWeiAmount(amount);
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const startBorrowLocked = checkMaintenance(States.START_BORROW);

  // BORROW
  const [collaterals, setCollaterals] = useState<any[]>([]);
  const [tokenToCollarate, setTokenToCollarate] = useState<Asset>(Asset.DOC);
  const [collateralTokenSent, setCollateralTokenSent] = useState('0');

  // Update list of collaterals for borrow and assign current one to first in array if previous selection is not available
  useEffect(() => {
    const loanPool = LendingPoolDictionary.get(currency);
    const options = loanPool
      .getBorrowCollateral()
      .map(item => AssetsDictionary.get(item))
      .map(item => ({
        key: item.asset,
        label: item.symbol,
        dataActionId: 'borrow-assetToCollateralizeAmountDropDown',
      }));

    setAmount('');
    setCollaterals(options);
    setTokenToCollarate(tokenToCollarate => {
      if (
        !options.find(item => item.key === tokenToCollarate) &&
        options.length
      ) {
        return options[0].key;
      }
      return tokenToCollarate;
    });
  }, [currency]);

  const tokenToBorrow = currency;
  const initialLoanDuration = 60 * 60 * 24 * borrowDays;

  const { value: requiredCollateral } = useLending_getDepositAmountForBorrow(
    tokenToBorrow,
    tokenToCollarate,
    borrowAmount,
    initialLoanDuration.toString(),
  );

  // Add buffer to collateralTokenSent of 0.2%, to prevent failing transaction
  // in case token price changes between tx start and mining
  useEffect(() => {
    setCollateralTokenSent(bignumber(requiredCollateral).mul(1.002).toFixed(0));
  }, [requiredCollateral]);

  const { borrow, ...txStateBorrow } = useApproveAndBorrow(
    tokenToBorrow,
    tokenToCollarate,
    borrowAmount,
    collateralTokenSent,
    initialLoanDuration.toString(),
  );

  const { value: tokenBalance } = useAssetBalanceOf(tokenToCollarate);
  const {
    value: maxAmount,
    loading: loadingLimit,
  } = useLending_transactionLimit(currency, tokenToCollarate);

  const handleSubmitBorrow = () => {
    borrow();
  };

  const handleBorrowDaysChange = (valueAsNumber: number) => {
    setBorrowDays(valueAsNumber);
  };

  const handleInteraction = (isOpenBorrowPopover: boolean) => {
    setBorrowDaysPopup(isOpenBorrowPopover);
  };

  const valid = useIsAmountWithinLimits(
    collateralTokenSent,
    '1',
    maxAmount !== '0'
      ? min(bignumber(maxAmount), bignumber(tokenBalance))
      : tokenBalance,
  );

  const popoverContent = (
    <div className={styles.popoverBorrow}>
      {t(translations.lend.borrowingContainer.chooseDays)}
      <NumericInput
        min={1}
        max={30}
        onValueChange={handleBorrowDaysChange}
        clampValueOnBlur={true}
        value={borrowDays}
      />
      <button className="bp3-button bp3-popover-dismiss">
        {t(translations.modal.close)}
      </button>
    </div>
  );

  useEffect(() => {
    dispatch(actions.changeBorrowAmount(amount));
  }, [amount, dispatch]);

  const { isSufficient, availableAmount } = useLending_testAvailableSupply(
    currency,
    borrowAmount,
  );

  return (
    <>
      <FieldGroup label={t(translations.lend.borrowingContainer.amount)}>
        <AmountField
          value={amount}
          onChange={value => setAmount(value)}
          rightElement={
            <button className="btn" type="button">
              {currency}
            </button>
          }
          dataActionId="borrow-amountInput"
        />
      </FieldGroup>
      <div className="tw-grid tw-grid-cols-12">
        {isShowedBorrowDays && (
          <div className="tw-col-span-12">
            Borrow for {}
            <Popover
              content={popoverContent}
              interactionKind={PopoverInteractionKind.CLICK}
              isOpen={borrowDaysPopup}
              onInteraction={state => handleInteraction(state)}
              position={Position.BOTTOM}
            >
              <a href="#!">{borrowDays} days.</a>
            </Popover>
          </div>
        )}
        <div className="tw-col-span-12">
          <div className="tw-grid tw-grid-cols-12 tw--mx-4">
            <div className="tw-col-span-12 tw-text-gray-6 tw-px-4">
              {
                <>
                  {t(translations.lend.borrowingContainer.tokenAssetCollateral)}{' '}
                  {maxAmount !== '0' && !loadingLimit && (
                    <span className="tw-text-gray-6">
                      (Max: {weiTo4(maxAmount)} {tokenToCollarate})
                    </span>
                  )}
                </>
              }
            </div>
            <div className="tw-col-span-4 tw-px-4">
              <FieldGroup label="">
                <FormSelect
                  onChange={item => setTokenToCollarate(item.key)}
                  value={tokenToCollarate}
                  items={collaterals}
                  dataActionId="borrow-assetToCollateralizeAmountDropDown"
                />
              </FieldGroup>
            </div>
            <div className="tw-col-span-8 tw-px-4">
              <FieldGroup label="">
                <DummyField>
                  {weiToFixed(collateralTokenSent, 6)} {tokenToCollarate}
                </DummyField>
              </FieldGroup>
            </div>
          </div>
        </div>
      </div>
      <SendTxProgress {...txStateBorrow} displayAbsolute={false} />
      <div className="tw-flex tw-flex-col lg:tw-flex-row lg:tw-justify-between lg:tw-items-center">
        <div className="tw-mb-4 lg:tw-mb-0">
          <AssetWalletBalance asset={tokenToCollarate} />
        </div>
        <TradeButton
          text={t(translations.lend.borrowingContainer.borrow) + ` ${currency}`}
          onClick={handleSubmitBorrow}
          disabled={
            !valid ||
            !isConnected ||
            txStateBorrow.loading ||
            txStateBorrow.status === TxStatus.PENDING_FOR_USER ||
            txStateBorrow.status === TxStatus.PENDING ||
            !isSufficient ||
            startBorrowLocked
          }
          loading={txStateBorrow.loading}
          tooltip={
            !isSufficient ? (
              <>
                <p className="tw-mb-1">
                  {t(translations.lendingPage.liquidity.borrow.line_1, {
                    currency,
                  })}
                </p>
                <p>
                  {t(translations.lendingPage.liquidity.borrow.line_2, {
                    currency,
                    amount: weiTo4(availableAmount),
                  })}
                </p>
                <p className="tw-mb-0">
                  {t(translations.lendingPage.liquidity.borrow.line_3)}
                </p>
              </>
            ) : startBorrowLocked ? (
              <>{t(translations.maintenance.startBorrow)}</>
            ) : undefined
          }
          dataActionId={`borrow-borrowButton-${tokenToCollarate}`}
        />
      </div>
    </>
  );
};
