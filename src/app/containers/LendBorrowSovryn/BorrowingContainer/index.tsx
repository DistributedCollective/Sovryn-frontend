import React, { ChangeEvent, useEffect, useState } from 'react';
import { useAssetBalanceOf } from '../../../hooks/useAssetBalanceOf';
import { useIsConnected } from '../../../hooks/useAccount';
import { useWeiAmount } from '../../../hooks/useWeiAmount';
import { useApproveAndBorrow } from '../../../hooks/trading/useApproveAndBorrow';
import { useIsAmountWithinLimits } from '../../../hooks/useIsAmountWithinLimits';
import TabContainer from '../components/TabContainer';
import '../assets/index.scss';
import { Asset } from '../../../../types/asset';
import { useSovryn_getRequiredCollateral } from '../../../hooks/protocol/useSovryn_getRequiredCollateral';
import { useApproveAndCloseWithDeposit } from '../../../hooks/trading/useApproveAndCloseWithDeposit';

type Props = {
  currency: 'BTC' | 'DOC';
};

const BorrowingContainer: React.FC<Props> = ({ currency }) => {
  const [amount, setAmount] = useState<string>('');
  const isConnected = useIsConnected();
  const weiAmount = useWeiAmount(amount);

  const onChangeAmount = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value as string);
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

  const tokenToBorrow = Asset.DOC;
  const tokenToCollarate = Asset.BTC;
  const withdrawAmount = '20000000000000000000'; // 20 doc
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
  } = useApproveAndCloseWithDeposit(
    currency === Asset.BTC ? Asset.BTC : Asset.DOC,
    tokenToCollarate,
    borrowAmount,
  );

  const { value: tokenBalance } = useAssetBalanceOf(tokenToCollarate);

  const handleSubmitBorrow = () => borrow();

  const handleSubmitCloseWithDeposit = () => {
    closeWithDeposit();
  };

  const valid = useIsAmountWithinLimits(weiAmount, '1', tokenBalance);

  return (
    <TabContainer
      setBorrowAmount={setBorrowAmount}
      onMaxChange={onMaxChange}
      txState={txStateBorrow}
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
