/**
 *
 * WithdrawLentAmount
 *
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Asset } from 'types/asset';
import { useCacheCallWithValue } from '../../hooks/useCacheCallWithValue';
import { getLendingContractName } from '../../../utils/blockchain/contract-helpers';
import { useAccount } from '../../hooks/useAccount';
import { useUnLendTokensRBTC } from '../../hooks/useUnLendTokensRBTC';
import { WithdrawLentDialog } from '../../components/WithdrawLentDialog';
import { toWei } from 'web3-utils';
import { weiTo18, weiToBigInt } from '../../../utils/blockchain/math-helpers';
import { useTokenPrice } from '../../hooks/lending/useTokenPrice';
import { bignumber } from 'mathjs';
import { useUnLendTokens } from '../../hooks/useUnLendTokens';

interface Props {
  asset: Asset;
  isOpen: boolean;
  onClose: () => void;
}

export function WithdrawLentAmount(props: Props) {
  const { value: balance } = useCacheCallWithValue(
    getLendingContractName(props.asset),
    'assetBalanceOf',
    '0',
    useAccount(),
  );
  const { value: price } = useTokenPrice(props.asset);

  const [amount, setAmount] = useState(weiTo18(balance));
  const fixedAmount = weiToBigInt(amount);
  const { unLend: unlendToken, ...txTokenState } = useUnLendTokens(props.asset);
  const { unLend: unlendBtc, ...txBtcState } = useUnLendTokensRBTC(props.asset);

  const handleUnLendClick = useCallback(() => {
    if (props.asset === Asset.BTC) {
      unlendBtc(fixedAmount);
    } else {
      unlendToken(fixedAmount);
    }
  }, [props.asset, unlendBtc, fixedAmount, unlendToken]);

  useEffect(() => {
    const result = bignumber(balance).div(price).toFixed(18);
    if (!isNaN(Number(result)) && isFinite(Number(result))) {
      setAmount(weiToBigInt(result));
    }
  }, [balance, price]);

  return (
    <WithdrawLentDialog
      asset={props.asset}
      amount={fixedAmount}
      balance={balance}
      onChangeAmount={value => setAmount(value)}
      onConfirm={() => handleUnLendClick()}
      txState={props.asset === Asset.BTC ? txBtcState : txTokenState}
      isOpen={props.isOpen}
      onClose={() => props.onClose()}
    />
  );
}
