import React, { useEffect, useState } from 'react';
import { useAssetBalanceOf } from '../../../hooks/useAssetBalanceOf';
import { useIsConnected } from '../../../hooks/useAccount';
import { useWeiAmount } from '../../../hooks/useWeiAmount';
import { useApproveAndBorrow } from '../../../hooks/trading/useApproveAndBorrow';
import { useIsAmountWithinLimits } from '../../../hooks/useIsAmountWithinLimits';
import '../assets/index.scss';
import { Asset } from '../../../../types/asset';
import { useSovryn_getRequiredCollateral } from '../../../hooks/protocol/useSovryn_getRequiredCollateral';
import { AssetsDictionary } from '../../../../utils/blockchain/assets-dictionary';
import { FormSelect } from '../../../components/FormSelect';
import { FieldGroup } from '../../../components/FieldGroup';
import { AmountField } from '../../AmountField';
import { AssetWalletBalance } from '../../../components/AssetWalletBalance';
import { DummyField } from '../../../components/DummyField/Loadable';
import { weiTo4 } from '../../../../utils/blockchain/math-helpers';
import { TradeButton } from '../../../components/TradeButton';
import { SendTxProgress } from '../../../components/SendTxProgress';
import { bignumber } from 'mathjs';
import { useDispatch } from 'react-redux';
import { actions } from '../slice';

type Props = {
  currency: Asset;
};

const BorrowingContainer: React.FC<Props> = ({ currency }) => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState<string>('');
  const isConnected = useIsConnected();
  const borrowAmount = useWeiAmount(amount);

  // BORROW
  const [collaterals, setCollaterals] = useState<any[]>([]);
  const [tokenToCollarate, setTokenToCollarate] = useState<Asset>(Asset.DOC);
  const [collateralTokenSent, setCollateralTokenSent] = useState('0');

  // Update list of collaterals for borrow and assign current one to first in array if previous selection is not available
  useEffect(() => {
    const options = AssetsDictionary.list()
      .filter(item => item.asset !== currency)
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

  const handleSubmitBorrow = () => {
    borrow();
  };

  const valid = useIsAmountWithinLimits(collateralTokenSent, '1', tokenBalance);

  useEffect(() => {
    dispatch(actions.changeBorrowAmount(amount));
  }, [amount, dispatch]);

  return (
    <>
      <FieldGroup label="Amount to borrow">
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
          <FieldGroup label="Token to collarate">
            <FormSelect
              onChange={item => setTokenToCollarate(item.key)}
              value={tokenToCollarate}
              items={collaterals}
            />
          </FieldGroup>
        </div>
        <div className="col-8">
          <FieldGroup label="Collateral amount">
            <DummyField>
              {weiTo4(collateralTokenSent)} {tokenToCollarate}
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
          text={`Borrow ${currency}`}
          onClick={handleSubmitBorrow}
          disabled={!valid || !isConnected || txStateBorrow.loading}
          loading={txStateBorrow.loading}
        />
      </div>
    </>
  );
};

export default BorrowingContainer;
