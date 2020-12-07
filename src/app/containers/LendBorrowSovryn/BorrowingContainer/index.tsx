import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useAssetBalanceOf } from '../../../hooks/useAssetBalanceOf';
import { useWeiAmount } from '../../../hooks/useWeiAmount';
import { useApproveAndBorrow } from '../../../hooks/trading/useApproveAndBorrow';
import { useIsAmountWithinLimits } from '../../../hooks/useIsAmountWithinLimits';
import '../assets/index.scss';
import { Asset } from '../../../../types/asset';
import { useSovryn_getRequiredCollateral } from '../../../hooks/protocol/useSovryn_getRequiredCollateral';
import { AssetsDictionary } from '../../../../utils/dictionaries/assets-dictionary';
import { FormSelect } from '../../../components/FormSelect';
import { FieldGroup } from '../../../components/FieldGroup';
import { AmountField } from '../../AmountField';
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

type Props = {
  currency: Asset;
};

const BorrowingContainer: React.FC<Props> = ({ currency }) => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState<string>('');
  const isConnected = useCanInteract();
  const borrowAmount = useWeiAmount(amount);
  const { t } = useTranslation();

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
      }));
    setCollaterals(options);
    if (
      !options.find(item => item.key === tokenToCollarate) &&
      options.length
    ) {
      setTokenToCollarate(options[0].key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  const tokenToBorrow = currency;
  const initialLoanDuration = 60 * 60 * 24 * 10; // 10 days

  const { value: requiredCollateral } = useSovryn_getRequiredCollateral(
    tokenToBorrow,
    tokenToCollarate,
    borrowAmount,
    '50000000000000000000',
    true,
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

  const valid = useIsAmountWithinLimits(
    collateralTokenSent,
    '1',
    maxAmount !== '0' ? min(maxAmount, tokenBalance) : tokenBalance,
  );

  useEffect(() => {
    dispatch(actions.changeBorrowAmount(amount));
  }, [amount, dispatch]);

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
        />
      </FieldGroup>
      <div className="row">
        <div className="col-4">
          <FieldGroup label={t(translations.lend.borrowingContainer.token)}>
            <FormSelect
              onChange={item => setTokenToCollarate(item.key)}
              value={tokenToCollarate}
              items={collaterals}
            />
          </FieldGroup>
        </div>
        <div className="col-8">
          <FieldGroup
            label={
              <>
                {t(translations.lend.borrowingContainer.collateralAmount)}{' '}
                {maxAmount !== '0' && !loadingLimit && (
                  <span className="text-muted">
                    (Max: {weiTo4(maxAmount)} {tokenToCollarate})
                  </span>
                )}
              </>
            }
          >
            <DummyField>
              {weiToFixed(collateralTokenSent, 6)} {tokenToCollarate}
            </DummyField>
          </FieldGroup>
        </div>
      </div>
      <SendTxProgress {...txStateBorrow} displayAbsolute={false} />
      <div className="d-flex flex-column flex-lg-row justify-content-lg-between align-items-lg-center">
        <div className="mb-3 mb-lg-0">
          <AssetWalletBalance asset={tokenToCollarate} />
        </div>
        <TradeButton
          text={t(translations.lend.borrowingContainer.borrow) + ` ${currency}`}
          onClick={handleSubmitBorrow}
          disabled={!valid || !isConnected || txStateBorrow.loading}
          loading={txStateBorrow.loading}
        />
      </div>
    </>
  );
};

export default BorrowingContainer;
