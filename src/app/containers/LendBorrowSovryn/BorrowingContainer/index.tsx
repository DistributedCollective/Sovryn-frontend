import React, { useEffect, useState } from 'react';
import { useAssetBalanceOf } from '../../../hooks/useAssetBalanceOf';
import { useIsConnected } from '../../../hooks/useAccount';
import { useWeiAmount } from '../../../hooks/useWeiAmount';
import { useApproveAndBorrow } from '../../../hooks/trading/useApproveAndBorrow';
import { useIsAmountWithinLimits } from '../../../hooks/useIsAmountWithinLimits';
import TabContainer, { TxType } from '../components/TabContainer';
import '../assets/index.scss';
import { Asset } from '../../../../types/asset';
import { useSovryn_getRequiredCollateral } from '../../../hooks/protocol/useSovryn_getRequiredCollateral';
import { useApproveAndCloseWithDeposit } from '../../../hooks/trading/useApproveAndCloseWithDeposit';
import { TransactionStatus } from '../../../../types/transaction-status';

type Props = {
  currency: Asset;
};

const BorrowingContainer: React.FC<Props> = ({ currency }) => {
  const [amount, setAmount] = useState<string>('');
  const isConnected = useIsConnected();
  const weiAmount = useWeiAmount(amount);

  const onChangeAmount = (e: string) => {
    setAmount(e);
  };

  const onMaxChange = (max: string) => {
    setAmount(max);
  };

  // BORROW
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [borrowAmount, setBorrowAmount] = useState('0');

  useEffect(() => {
    // @ts-ignore
    setBorrowAmount(weiAmount);
  }, [amount, weiAmount]);

  const tokenToBorrow = currency;
  const tokenToCollarate = currency === Asset.BTC ? Asset.DOC : Asset.BTC;
  const initialLoanDuration = 60 * 60 * 24 * 10; // 10 days

  const { value: collateralTokenSent } = useSovryn_getRequiredCollateral(
    tokenToBorrow,
    tokenToCollarate,
    borrowAmount,
    '50000000000000000000',
    true,
  );

  const { borrow, ...txStateBorrow } = useApproveAndBorrow(
    tokenToBorrow,
    tokenToCollarate,
    borrowAmount,
    collateralTokenSent,
    initialLoanDuration.toString(),
  );

  const {
    closeWithDeposit,
    ...txStateCloseWithDeposit
  } = useApproveAndCloseWithDeposit(currency, tokenToCollarate, borrowAmount);

  const { value: tokenBalance } = useAssetBalanceOf(tokenToCollarate);

  const handleSubmitBorrow = () => {
    borrow();
  };

  const handleSubmitCloseWithDeposit = () => {
    closeWithDeposit();
  };

  const valid = useIsAmountWithinLimits(weiAmount, '1', tokenBalance);

  return (
    <TabContainer
      setBorrowAmount={setBorrowAmount}
      onMaxChange={onMaxChange}
      txState={
        txStateBorrow.status !== 'none' && txStateBorrow.loading
          ? txStateBorrow
          : txStateCloseWithDeposit
      }
      isConnected={isConnected}
      valid={valid}
      leftButton="Borrow"
      rightButton="Repay"
      amountValue={amount}
      onChangeAmount={onChangeAmount}
      handleSubmit={handleSubmitBorrow}
      handleSubmitRepay={handleSubmitCloseWithDeposit}
      currency={currency}
      amountName="Borrow Amount"
      maxValue={''}
    />
  );
};

export default BorrowingContainer;
