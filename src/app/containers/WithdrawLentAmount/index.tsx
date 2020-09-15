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
import { weiTo18 } from '../../../utils/blockchain/math-helpers';
import { useTokenPrice } from '../../hooks/lending/useTokenPrice';
import { bignumber } from 'mathjs';

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
  const { unLend, ...txState } = useUnLendTokensRBTC(props.asset);

  const handleUnLendClick = useCallback(() => {
    unLend(toWei(amount));
  }, [unLend, amount]);

  useEffect(() => {
    setAmount(bignumber(balance).div(price).toFixed(18));
  }, [balance, price]);

  return (
    <WithdrawLentDialog
      asset={props.asset}
      amount={amount}
      balance={balance}
      onChangeAmount={value => setAmount(value)}
      onConfirm={() => handleUnLendClick()}
      txState={txState}
      isOpen={props.isOpen}
      onClose={() => props.onClose()}
    />
  );
}
