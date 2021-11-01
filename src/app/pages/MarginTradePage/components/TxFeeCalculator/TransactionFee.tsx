import React from 'react';

import type { TransactionConfig } from 'web3-core';
import { fromWei } from 'utils/blockchain/math-helpers';
import { bignumber } from 'mathjs';
import { ContractName } from 'utils/types/contracts';
import { useEstimateContractGas } from 'app/hooks/useEstimateGas';
import { toNumberFormat, weiToNumberFormat } from 'utils/display-text/format';
import { gas } from 'utils/blockchain/gas-price';
import { LoadableValue } from 'app/components/LoadableValue';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { Asset } from 'types';

interface Props {
  asset?: Asset;
  contractName: ContractName;
  methodName: string;
  args: any[];
  txConfig?: TransactionConfig;
  condition?: boolean;
}

export function TransactionFee(props: Props) {
  const { value, loading, error, gasPrice, gasLimit } = useEstimateContractGas(
    props.contractName,
    props.methodName,
    props.args,
    props.txConfig,
    props.condition,
  );
  const gasData = React.useMemo(() => {
    const data = props.txConfig?.gas
      ? fromWei(bignumber(props.txConfig?.gas).mul(gas.get()).toFixed(0))
      : fromWei(value);
    return data;
  }, [props.txConfig, value]);

  return (
    <LoadableValue
      value={
        <>
          {weiToNumberFormat(value, 8)}{' '}
          <AssetSymbolRenderer asset={props.asset} />
        </>
      }
      loading={loading}
      tooltip={
        <>
          {gasData} <AssetSymbolRenderer asset={props.asset} />
          <br />
          <small className="tw-text-gray-6">
            (gas price: {toNumberFormat(Number(fromWei(gasPrice, 'gwei')), 3)}{' '}
            gwei)
          </small>
          <br />
          <small className="tw-text-gray-6">
            (gas limit: {gasLimit} units)
          </small>
          {error && <p className="tw-text-warning">{error}</p>}
        </>
      }
    />
  );
}

TransactionFee.defaultProps = {
  asset: Asset.RBTC,
  config: {},
  condition: true,
};
