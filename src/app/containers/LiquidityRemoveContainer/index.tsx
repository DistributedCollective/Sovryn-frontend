/**
 *
 * LiquidityRemoveContainer
 *
 */

import React, { useCallback, useState } from 'react';
import { liquidityPools } from '../../../utils/classifiers';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { Button, InputGroup, Text } from '@blueprintjs/core';
import { FormSelect } from '../../components/FormSelect';
import { LoadableValue } from '../../components/LoadableValue';
import { weiTo4, weiTo18 } from '../../../utils/blockchain/math-helpers';
import { SendTxProgress } from '../../components/SendTxProgress';
import { usePoolToken } from '../../hooks/amm/usePoolToken';
import { usePoolTokenBalance } from '../../hooks/amm/usePoolTokenBalance';
import { useRemoveLiquidity } from '../../hooks/amm/useRemoveLiquidity';
import { TransactionStatus } from '../../../types/transaction-status';
import { useRemoveLiquidityReturnAndFee } from '../../hooks/amm/useRemoveLiquidityReturnAndFee';
import { handleNumberInput } from '../../../utils/helpers';

interface Props {}

export function LiquidityRemoveContainer(props: Props) {
  const tokens = liquidityPools.map(item => ({
    key: item.source,
    label: item.tokenLabel,
  }));

  const [sourceToken, setSourceToken] = useState(tokens[0].key);
  const balance = usePoolTokenBalance(sourceToken);
  const [amount, setAmount] = useState(weiTo18(balance.value));

  const poolAddress = usePoolToken(sourceToken);
  const weiAmount = useWeiAmount(amount);

  const {
    value: targetValue,
    loading: targetLoading,
  } = useRemoveLiquidityReturnAndFee(poolAddress.value, weiAmount);

  const tx = useRemoveLiquidity(poolAddress.value, weiAmount, '1');

  const handleWithdraw = useCallback(() => {
    tx.withdraw();
  }, [tx]);

  const handlePoolChange = useCallback(item => {
    setSourceToken(item.key);
  }, []);

  const amountValid = () => {
    return Number(weiAmount) > 0 && Number(weiAmount) <= Number(balance.value);
  };

  return (
    <div className="bg-secondary p-3">
      <h3 className="mb-3">Remove Liquidity</h3>
      <div className="d-flex flex-row justify-content-between">
        <div className="data-label">Amount</div>
        <div className="flex-grow-1 mx-2 data-container">
          <InputGroup
            className="mb-0"
            value={amount}
            onChange={e => setAmount(handleNumberInput(e))}
            placeholder="Enter amount"
          />
        </div>
        <div className="data-container">
          <FormSelect
            filterable={false}
            items={tokens}
            onChange={handlePoolChange}
            value={sourceToken}
          />
        </div>
      </div>
      <div className="d-flex flex-row justify-content-center">
        {Number(weiAmount) > 0 &&
          !balance.loading &&
          Number(weiAmount) > Number(balance.value) && (
            <div className="font-xs text-Gold">
              Trade amount exceeds balance
            </div>
          )}
      </div>
      <div className="d-flex flex-row justify-content-between mt-3">
        <div className="data-label">Balance</div>

        <div className="data-container flex-grow-1 mx-2 small">
          <LoadableValue
            loading={balance.loading}
            value={<Text ellipsize>{weiTo18(balance.value)}</Text>}
            tooltip={weiTo18(balance.value)}
          />
        </div>
        <div className="small data-container">{sourceToken}</div>
      </div>
      <div className="border shadow my-3 p-3 bg-secondary">
        <div className="row">
          <div className="col">
            <div className="font-weight-bold small">
              <LoadableValue
                loading={targetLoading}
                value={
                  <Text ellipsize>
                    {weiTo4(targetValue[0])} {sourceToken}
                  </Text>
                }
                tooltip={targetValue[0]}
              />
            </div>
            <div className="small">Target Amount</div>
          </div>
          <div className="col">
            <div className="font-weight-bold small">
              <LoadableValue
                loading={targetLoading}
                value={
                  <Text ellipsize>
                    {weiTo4(targetValue[1])} {sourceToken}
                  </Text>
                }
                tooltip={targetValue[1]}
              />
            </div>
            <div className="small">Fee</div>
          </div>
        </div>
      </div>

      <Button
        text="Withdraw"
        onClick={handleWithdraw}
        loading={tx.loading}
        disabled={tx.loading || !amountValid()}
      />
      {tx.status !== TransactionStatus.NONE && (
        <div className="mb-4">
          <SendTxProgress
            status={tx.status}
            txHash={tx.txHash}
            loading={tx.loading}
            type={'withdraw'}
          />
        </div>
      )}
    </div>
  );
}
