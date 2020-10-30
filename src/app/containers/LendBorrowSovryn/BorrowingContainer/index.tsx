import React, { ChangeEvent, useEffect, useState } from 'react';
import { useAssetBalanceOf } from '../../../hooks/useAssetBalanceOf';
import { useIsConnected } from '../../../hooks/useAccount';
import { useWeiAmount } from '../../../hooks/useWeiAmount';
import { useSelector } from 'react-redux';
import { selectTradingPage } from '../../TradingPage/selectors';
import { TradingPairDictionary } from '../../../../utils/trading-pair-dictionary';
import { TradingPosition } from '../../../../types/trading-position';
import { useApproveAndBorrow } from '../../../hooks/trading/useApproveAndBorrow';
import { useIsAmountWithinLimits } from '../../../hooks/useIsAmountWithinLimits';
import TabContainer, { TxType } from '../components/TabContainer';
import '../assets/index.scss';
import { Asset } from '../../../../types/asset';
import { TransactionStatus } from '../../../../types/transaction-status';
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
  const { tradingPair } = useSelector(selectTradingPage);

  const pair = TradingPairDictionary.get(tradingPair);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [position, setPosition] = useState(TradingPosition.LONG);
  const [borrowAmount, setBorrowAmount] = useState('0');

  useEffect(() => {
    // @ts-ignore
    setBorrowAmount(weiAmount);
  }, [amount, weiAmount]);

  const { borrow, ...txStateBorrow } = useApproveAndBorrow(
    currency === Asset.BTC ? Asset.BTC : Asset.DOC,
    pair.getCollateralForPosition(position)[0],
    borrowAmount,
    weiAmount,
  );

  const {
    closeWithDeposit,
    ...txStateCloseWithDeposit
  } = useApproveAndCloseWithDeposit(
    currency === Asset.BTC ? Asset.BTC : Asset.DOC,
    pair.getCollateralForPosition(position)[0],
    borrowAmount,
  );

  const { value: tokenBalance } = useAssetBalanceOf(
    pair.getCollateralForPosition(position)[0],
  );

  const handleSubmitBorrow = () => borrow();

  const handleSubmitCloseWithDeposit = () => closeWithDeposit();

  const [txState, setTxState] = useState<{
    type: TxType;
    txHash: string;
    status: TransactionStatus;
    loading: boolean;
  }>({
    type: TxType.NONE,
    txHash: null as any,
    status: TransactionStatus.NONE,
    loading: false,
  });

  useEffect(() => {
    if (
      txStateCloseWithDeposit.status !== 'none' &&
      txStateCloseWithDeposit.txHash
    ) {
      setTxState({ ...txStateCloseWithDeposit });
    }
  }, [txStateCloseWithDeposit]);

  useEffect(() => {
    if (txStateBorrow.status !== 'none' && txStateBorrow.txHash) {
      setTxState({ ...txStateBorrow });
    }
  }, [txStateBorrow]);

  const valid = useIsAmountWithinLimits(weiAmount, '1', tokenBalance);

  return (
    <TabContainer
      setBorrowAmount={setBorrowAmount}
      onMaxChange={onMaxChange}
      txState={txState}
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
