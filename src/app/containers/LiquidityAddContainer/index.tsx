/**
 *
 * LiquidityAddContainer
 *
 */

import React, { useCallback, useState } from 'react';
import { Button, InputGroup, Text } from '@blueprintjs/core';
import { FormSelect } from '../../components/FormSelect';
import { weiTo4 } from '../../../utils/blockchain/math-helpers';
import { SendTxProgress } from '../../components/SendTxProgress';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { useExpectedPoolTokens } from '../../hooks/amm/useExpectedPoolTokens';
import { useApproveAndAddLiquidity } from '../../hooks/amm/useApproveAndAddLiquidity';
import { LoadableValue } from '../../components/LoadableValue';
import { liquidityPools } from '../../../utils/classifiers';
import { handleNumberInput } from '../../../utils/helpers';
import { useBalanceOf } from '../../hooks/erc20/useBalanceOf';
import { getTokenContractName } from '../../../utils/blockchain/contract-helpers';

interface Props {}

export function LiquidityAddContainer(props: Props) {
  const tokens = liquidityPools.map(item => ({
    key: item.source,
    target: item.target,
    label: item.label,
  }));

  const [sourceToken, setSourceToken] = useState(tokens[0].key);
  const [amount, setAmount] = useState('');

  const balance = useBalanceOf(getTokenContractName(sourceToken));
  const weiAmount = useWeiAmount(amount);

  const expectedPoolTokens = useExpectedPoolTokens(sourceToken, weiAmount);

  const tx = useApproveAndAddLiquidity(sourceToken, weiAmount, '1');

  const handleSupply = useCallback(() => {
    tx.deposit();
  }, [tx]);

  const handlePoolChange = useCallback(item => {
    setSourceToken(item.key);
  }, []);

  const amountValid = () => {
    return Number(weiAmount) > 0 && Number(weiAmount) <= Number(balance.value);
  };

  return (
    <div className="bg-secondary p-3">
      <h3 className="mb-3">Add Liquidity</h3>
      <div className="d-flex flex-row justify-content-between">
        <div className="flex-grow-1 mr-3">
          <InputGroup
            className="mb-0"
            value={amount}
            onChange={e => setAmount(handleNumberInput(e))}
            placeholder="Enter amount"
          />
          {Number(weiAmount) > 0 &&
            !balance.loading &&
            Number(weiAmount) > Number(balance.value) && (
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                Amount exceeds balance
              </div>
            )}
        </div>
        <div>
          <FormSelect
            filterable={false}
            items={tokens}
            onChange={handlePoolChange}
            value={sourceToken}
          />
        </div>
      </div>
      <div className="small mb-3">
        <LoadableValue
          loading={balance.loading}
          value={
            <Text ellipsize tagName="span">
              {weiTo4(balance.value)} {sourceToken}
            </Text>
          }
          tooltip={balance.value}
        />
      </div>

      <div className="border shadow my-3 p-3 bg-secondary">
        <div className="row">
          <div className="col">
            <div className="font-weight-bold small">
              <LoadableValue
                loading={expectedPoolTokens.loading}
                value={
                  <Text ellipsize tagName="span">
                    {weiTo4(expectedPoolTokens.value)}
                  </Text>
                }
                tooltip={expectedPoolTokens.value}
              />
            </div>
            <div className="small">Expected pool tokens</div>
          </div>
        </div>
      </div>

      <Button
        text="Supply"
        onClick={handleSupply}
        loading={tx.loading}
        disabled={tx.loading || !amountValid()}
      />

      {tx.type !== 'none' && (
        <div className="mb-4">
          <SendTxProgress
            status={tx.status}
            txHash={tx.txHash}
            loading={tx.loading}
            type={tx.type}
          />
        </div>
      )}
    </div>
  );
}
