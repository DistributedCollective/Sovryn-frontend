/**
 *
 * WithdrawLentAmount
 *
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Asset } from 'types/asset';
import { useAccount } from '../../hooks/useAccount';
import { useUnLendTokensRBTC } from '../../hooks/useUnLendTokensRBTC';
import { WithdrawLentDialog } from '../../components/WithdrawLentDialog';
import { weiTo18 } from '../../../utils/blockchain/math-helpers';
import { bignumber, min } from 'mathjs';
import { useUnLendTokens } from '../../hooks/useUnLendTokens';
import { useLending_totalAssetSupply } from '../../hooks/lending/useLending_totalAssetSupply';
import { useLending_totalAssetBorrow } from '../../hooks/lending/useLending_totalAssetBorrow';
import { useLending_assetBalanceOf } from '../../hooks/lending/useLending_assetBalanceOf';
import { useLending_tokenPrice } from '../../hooks/lending/useLending_tokenPrice';

interface Props {
  asset: Asset;
  isOpen: boolean;
  onClose: () => void;
}

export function WithdrawLentAmount(props: Props) {
  const { value: userBalance } = useLending_assetBalanceOf(
    props.asset,
    useAccount(),
  );
  const { value: totalAssetSupply } = useLending_totalAssetSupply(props.asset);
  const { value: totalAssetBorrow } = useLending_totalAssetBorrow(props.asset);
  const { value: tokenPrice } = useLending_tokenPrice(props.asset);

  const calculateBalance = useCallback(() => {
    const availableAssets = bignumber(totalAssetSupply).minus(totalAssetBorrow);
    return min(bignumber(userBalance), availableAssets).toString();
  }, [totalAssetSupply, totalAssetBorrow, userBalance]);

  const [balance, setBalance] = useState(calculateBalance());
  const [amount, setAmount] = useState(weiTo18(balance));
  const { unLend: unlendToken, ...txTokenState } = useUnLendTokens(props.asset);
  const { unLend: unlendBtc, ...txBtcState } = useUnLendTokensRBTC(props.asset);

  const [txAmount, setTxAmount] = useState('0');

  useEffect(() => {
    setBalance(calculateBalance());
  }, [userBalance, totalAssetBorrow, totalAssetSupply, calculateBalance]);

  useEffect(() => {
    setAmount(weiTo18(balance));
  }, [balance]);

  useEffect(() => {
    setTxAmount(
      bignumber(amount)
        .div(tokenPrice)
        .mul(10 ** 36)
        .toFixed(0),
    );
  }, [amount, tokenPrice]);

  const handleUnLendClick = useCallback(() => {
    if (props.asset === Asset.BTC) {
      unlendBtc(txAmount);
    } else {
      unlendToken(txAmount);
    }
  }, [props.asset, unlendBtc, txAmount, unlendToken]);

  return (
    <WithdrawLentDialog
      asset={props.asset}
      amount={amount}
      balance={balance}
      onChangeAmount={value => setAmount(value)}
      onConfirm={() => handleUnLendClick()}
      txState={props.asset === Asset.BTC ? txBtcState : txTokenState}
      isOpen={props.isOpen}
      onClose={() => props.onClose()}
    />
  );
}
