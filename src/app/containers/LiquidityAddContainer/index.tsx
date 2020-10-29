/**
 *
 * LiquidityAddContainer
 *
 */

import React, { useCallback, useState } from 'react';
import { Text } from '@blueprintjs/core';
import { FormSelect } from '../../components/FormSelect';
import { weiTo4, weiTo18 } from '../../../utils/blockchain/math-helpers';
import { SendTxProgress } from '../../components/SendTxProgress';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { useExpectedPoolTokens } from '../../hooks/amm/useExpectedPoolTokens';
import { useApproveAndAddLiquidity } from '../../hooks/amm/useApproveAndAddLiquidity';
import { LoadableValue } from '../../components/LoadableValue';
import { liquidityPools } from '../../../utils/classifiers';
import { useBalanceOf } from '../../hooks/erc20/useBalanceOf';
import { getTokenContractName } from '../../../utils/blockchain/contract-helpers';
import { FieldGroup } from '../../components/FieldGroup';
import { AmountField } from '../AmountField';
import { AssetWalletBalance } from '../../components/AssetWalletBalance';
import { TradeButton } from '../../components/TradeButton';
import { useAssetBalanceOf } from '../../hooks/useAssetBalanceOf';
import { useIsConnected } from '../../hooks/useAccount';

interface Props {}

export function LiquidityAddContainer(props: Props) {
  const isConnected = useIsConnected();
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

  const { value: tokenBalance } = useAssetBalanceOf(sourceToken);

  return (
    <>
      <div className="position-relative">
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
                onMaxClicked={() => setAmount(weiTo18(tokenBalance))}
                value={amount}
              />
            </FieldGroup>
          </div>
        </div>

        <div className="border shadow my-3 p-3 bg-white text-black">
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

        {tx.type !== 'none' && (
          <div className="mt-3">
            <SendTxProgress {...tx} displayAbsolute={false} />
          </div>
        )}

        <div className="d-flex flex-column flex-lg-row justify-content-lg-between align-items-lg-center">
          <div className="mb-3 mb-lg-0">
            <AssetWalletBalance asset={sourceToken} />
          </div>
          <TradeButton
            text="Supply"
            onClick={handleSupply}
            loading={tx.loading}
            disabled={!isConnected || tx.loading || !amountValid()}
          />
        </div>
      </div>
    </>
  );
}
