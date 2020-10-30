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
import TabContainer from '../components/TabContainer';
import '../assets/index.scss';
import { Asset } from '../../../../types/asset';
import { useSovryn_getRequiredCollateral } from '../../../hooks/protocol/useSovryn_getRequiredCollateral';

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

  const tokenToBorrow = Asset.DOC;
  const tokenToCollarate = Asset.BTC;
  const withdrawAmount = '20000000000000000000'; // 20 doc
  const initialLoanDuration = 60 * 60 * 24 * 10; // 10 days

  const { value: collateralTokenSent } = useSovryn_getRequiredCollateral(
    tokenToBorrow,
    tokenToCollarate,
    withdrawAmount,
    '50000000000000000000',
    true,
  );

  const { borrow, ...txState } = useApproveAndBorrow(
    tokenToBorrow,
    tokenToCollarate,
    withdrawAmount,
    collateralTokenSent,
    initialLoanDuration.toString(),
  );

  const { value: tokenBalance } = useAssetBalanceOf(
    pair.getCollateralForPosition(position)[0],
  );

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
