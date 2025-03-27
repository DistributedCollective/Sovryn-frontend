import React, { useEffect, useMemo } from 'react';
import type { TransactionConfig } from 'web3-core';
import { fromWei } from 'utils/blockchain/math-helpers';
import { ContractName } from 'utils/types/contracts';
import { useEstimateContractGas } from 'app/hooks/useEstimateGas';
import { toNumberFormat, weiToNumberFormat } from 'utils/display-text/format';
import { LoadableValue } from 'app/components/LoadableValue';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { Asset } from 'types';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import { gas } from 'utils/blockchain/gas-price';
import { bignumber } from 'mathjs';

interface ITransactionFeeProps {
  asset?: Asset;
  contractName: ContractName;
  methodName: string;
  args: any[];
  txConfig?: TransactionConfig;
  condition?: boolean;
  onFeeUpdated?: (value: string) => void;
  customLimit?: number;
  customLoading?: boolean;
}

export const TransactionFee: React.FC<ITransactionFeeProps> = ({
  asset = Asset.RBTC,
  contractName,
  methodName,
  args,
  txConfig = {},
  condition = true,
  onFeeUpdated,
  customLimit,
  customLoading,
}) => {
  const { t } = useTranslation();
  const {
    value: v,
    loading,
    error,
    gasPrice,
    gasLimit,
  } = useEstimateContractGas(
    contractName,
    methodName,
    args,
    txConfig,
    condition,
  );

  const value = useMemo(
    () =>
      bignumber(customLimit ?? v)
        .mul(gas.get())
        .toFixed(0),
    [customLimit, v],
  );

  useEffect(() => {
    if (onFeeUpdated && value) {
      onFeeUpdated(value);
    }
  }, [onFeeUpdated, value]);

  return (
    <LoadableValue
      value={
        <>
          {weiToNumberFormat(value, 6)} <AssetSymbolRenderer asset={asset} />
        </>
      }
      loading={customLoading ?? loading}
      tooltip={
        <>
          {fromWei(value)} <AssetSymbolRenderer asset={asset} />
          <br />
          <small className="tw-text-gray-6">
            ({t(translations.common.gasPrice)}:{' '}
            {toNumberFormat(Number(fromWei(gasPrice, 'gwei')), 3)} gwei)
          </small>
          <br />
          <small className="tw-text-gray-6">
            ({t(translations.common.gasLimit)}: {customLimit ?? gasLimit}{' '}
            {t(translations.common.units)})
          </small>
          {error && !customLimit && <p className="tw-text-warning">{error}</p>}
        </>
      }
    />
  );
};
