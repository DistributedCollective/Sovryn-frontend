/**
 *
 * LiquidityRemoveContainer
 *
 */

import React, { useCallback, useState } from 'react';
import { liquidityPools } from '../../../utils/classifiers';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { Text } from '@blueprintjs/core';
import { FormSelect } from '../../components/FormSelect';
import { LoadableValue } from '../../components/LoadableValue';
import {
  weiTo4,
  weiTo18,
  weiToFixed,
} from '../../../utils/blockchain/math-helpers';
import { SendTxProgress } from '../../components/SendTxProgress';
import { usePoolToken } from '../../hooks/amm/usePoolToken';
import { usePoolTokenBalance } from '../../hooks/amm/usePoolTokenBalance';
import { TransactionStatus } from '../../../types/transaction-status';
import { useRemoveLiquidityReturnAndFee } from '../../hooks/amm/useRemoveLiquidityReturnAndFee';
import { FieldGroup } from '../../components/FieldGroup';
import { AmountField } from '../AmountField';
import { TradeButton } from '../../components/TradeButton';
import { useApproveAndRemoveLiquidity } from '../../hooks/amm/useApproveAndRemoveLiquidity';
import { useCanInteract } from 'app/hooks/useCanInteract';

interface Props {}

export function LiquidityRemoveContainer(props: Props) {
  const isConnected = useCanInteract();
  const tokens = liquidityPools.map(item => ({
    key: item.source,
    label: `${item.tokenLabel} - Pool token`,
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

  const tx = useApproveAndRemoveLiquidity(
    sourceToken,
    poolAddress.value,
    weiAmount,
    '1',
  );

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
    <>
      <div className="row">
        <div className="col-6 pr-1">
          <FieldGroup label="Currency">
            <FormSelect
              onChange={handlePoolChange}
              placeholder="Select currency"
              value={sourceToken}
              items={tokens}
            />
          </FieldGroup>
        </div>
        <div className="col-6 pl-1">
          <FieldGroup label="Enter amount">
            <AmountField
              onChange={value => setAmount(value)}
              onMaxClicked={() => setAmount(weiTo18(balance.value))}
              value={amount}
            />
          </FieldGroup>
        </div>
      </div>

      <div className="border my-3 p-3 bg-white text-black">
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

      {tx.status !== TransactionStatus.NONE && (
        <div className="mt-3">
          <SendTxProgress {...tx} displayAbsolute={false} />
        </div>
      )}

      <div className="d-flex flex-column flex-lg-row justify-content-lg-between align-items-lg-center">
        <div className="mb-3 mb-lg-0">
          <div>
            <div className="font-weight-bold text-muted mb-2">
              Supplied Balance
            </div>
            {!isConnected && <span>Connect to wallet</span>}
            {isConnected && (
              <div className="d-flex flex-row justify-content-start align-items-center">
                <span className="text-muted">{sourceToken}</span>
                <span className="text-white font-weight-bold ml-2">
                  <LoadableValue
                    value={weiToFixed(balance.value, 4)}
                    loading={balance.loading}
                  />
                </span>
              </div>
            )}
          </div>
        </div>
        <TradeButton
          text="Withdraw"
          onClick={handleWithdraw}
          loading={tx.loading}
          disabled={!isConnected || tx.loading || !amountValid()}
        />
      </div>
    </>
  );
}
