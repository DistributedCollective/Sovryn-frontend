import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

import { useAssetBalanceOf } from '../../../hooks/useAssetBalanceOf';
import { useIsConnected } from '../../../hooks/useAccount';
import { Asset } from '../../../../types/asset';
import { useWeiAmount } from '../../../hooks/useWeiAmount';
import { useTokenAllowance } from '../../../hooks/useTokenAllowanceForLending';
import { useSelector } from 'react-redux';
import { selectTradingPage } from '../../TradingPage/selectors';
import { TradingPairDictionary } from '../../../../utils/trading-pair-dictionary';
import { useTranslation } from 'react-i18next';
import { TradingPosition } from '../../../../types/trading-position';
import { useApproveAndBorrow } from '../../../hooks/trading/useApproveAndBorrow';
import { useIsAmountWithinLimits } from '../../../hooks/useIsAmountWithinLimits';
import TabContainer, { TxType } from '../components/TabContainer';
import { TransactionStatus } from '../../../../types/transaction-status';
import { getLendingContract } from '../../../../utils/blockchain/contract-helpers';
import '../assets/index.scss';

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

  // BORROW
  const { tradingPair } = useSelector(selectTradingPage);

  const pair = TradingPairDictionary.get(tradingPair);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [position, setPosition] = useState(TradingPosition.LONG);
  const [borrowAmount, setBorrowAmount] = useState('0');
  const [collateral, setCollateral] = useState(
    pair.getCollateralForPosition(position)[0],
  );

  useEffect(() => {
    setCollateral(pair.getCollateralForPosition(position)[0]);
  }, [position, pair]);

  const { borrow, loading, txHash, status, type } = useApproveAndBorrow(
    pair.getAssetForPosition(position),
    collateral,
    borrowAmount,
    weiAmount,
  );

  useEffect(() => {
    setTxState({ loading, txHash, status, type });
  }, [loading, status, txHash, type]);

  const { value: tokenBalance } = useAssetBalanceOf(collateral);

  const handleSubmitBorrow = () => borrow();
  const valid = useIsAmountWithinLimits(weiAmount, '1', tokenBalance);

  return (
    <TabContainer
      setBorrowAmount={setBorrowAmount}
      onMaxChange={onMaxChange}
      txState={txState}
      isConnected={isConnected}
      valid={valid}
      leftButton="Borrow"
      rightButton="Replay"
      amountValue={amount}
      onChangeAmount={onChangeAmount}
      handleSubmit={handleSubmitBorrow}
      currency={currency}
      amountName="Borrow Amount"
      maxValue={''}
    />
  );
};

export default BorrowingContainer;
