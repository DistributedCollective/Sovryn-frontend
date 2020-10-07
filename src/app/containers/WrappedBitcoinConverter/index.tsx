/**
 *
 * WrappedBitcoinConverter
 *
 */

import React, { useCallback, useState } from 'react';
import { Button, InputGroup, Text } from '@blueprintjs/core';
import { handleNumberInput } from '../../../utils/helpers';
import { FormSelect } from '../../components/FormSelect';
import { LoadableValue } from '../../components/LoadableValue';
import { weiTo4, weiToBigInt } from '../../../utils/blockchain/math-helpers';
import { SendTxProgress } from '../../components/SendTxProgress';
import { useBalanceOf } from '../../hooks/erc20/useBalanceOf';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { getTokenContractName } from '../../../utils/blockchain/contract-helpers';
import { Asset } from '../../../types/asset';
import { useBalance } from '../../hooks/useBalance';
import {
  ConvertionType,
  useConvertBitcoin,
} from '../../hooks/useConvertBitcoin';

interface Props {}

export function WrappedBitcoinConverter(props: Props) {
  const options = [
    { key: ConvertionType.WRAP, label: 'rBTC -> wRBTC' },
    { key: ConvertionType.UNWRAP, label: 'wRBTC -> rBTC' },
  ];

  const [mode, setMode] = useState(options[0].key);
  const [amount, setAmount] = useState('0');

  const rbtcBalance = useBalance();
  const wRbtcBalance = useBalanceOf(getTokenContractName(Asset.BTC));
  const weiAmount = useWeiAmount(weiToBigInt(amount));

  const tx = useConvertBitcoin(mode, weiAmount);

  const handleConversion = useCallback(() => {
    tx.convert();
  }, [tx]);

  const amountValid = () => {
    return (
      Number(weiAmount) > 0 &&
      Number(weiAmount) <=
        Number(
          mode === ConvertionType.WRAP ? rbtcBalance.value : wRbtcBalance.value,
        )
    );
  };

  return (
    <div className="bg-secondary p-3">
      <h3 className="mb-3">Convert wRBTC</h3>
      <div className="d-flex flex-row justify-content-between">
        <div className="flex-grow-1 mr-3">
          <InputGroup
            className="mb-0"
            value={amount}
            onChange={e => setAmount(handleNumberInput(e))}
            placeholder="Enter amount"
          />
          {Number(amount) > 0 && !amountValid() && (
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
              Trade amount exceeds balance
            </div>
          )}
        </div>
        <div>
          <FormSelect
            filterable={false}
            items={options}
            onChange={e => setMode(e.key)}
            value={mode}
          />
        </div>
      </div>
      <div className="small mb-3">
        {mode === ConvertionType.WRAP && (
          <LoadableValue
            loading={rbtcBalance.loading}
            value={<Text ellipsize>{weiTo4(rbtcBalance.value)} rBTC</Text>}
            tooltip={rbtcBalance.value}
          />
        )}
        {mode === ConvertionType.UNWRAP && (
          <LoadableValue
            loading={wRbtcBalance.loading}
            value={<Text ellipsize>{weiTo4(wRbtcBalance.value)} wRBTC</Text>}
            tooltip={wRbtcBalance.value}
          />
        )}
      </div>

      <Button
        text="Convert"
        onClick={handleConversion}
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
