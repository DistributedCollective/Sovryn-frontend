import React from 'react';
import { useTranslation } from 'react-i18next';
import type { TransactionConfig } from 'web3-core';
import { translations } from 'locales/i18n';
import { fromWei } from 'utils/blockchain/math-helpers';
import { LoadableValue } from '../../../../components/LoadableValue';
import {
  toNumberFormat,
  weiToNumberFormat,
} from '../../../../../utils/display-text/format';
import { ContractName } from '../../../../../utils/types/contracts';
import { useEstimateContractGas } from '../../../../hooks/useEstimateGas';
import cn from 'classnames';
import { gas } from '../../../../../utils/blockchain/gas-price';
import { bignumber } from 'mathjs';

interface Props {
  symbol?: string;
  contractName: ContractName;
  methodName: string;
  args: any[];
  txConfig?: TransactionConfig;
  condition?: boolean;
  className?: string;
  textClassName?: string;
}

export function TxFeeCalculator(props: Props) {
  const { t } = useTranslation();
  const { value, loading, error, gasPrice, gasLimit } = useEstimateContractGas(
    props.contractName,
    props.methodName,
    props.args,
    props.txConfig,
    props.condition,
  );
  const gasData = React.useMemo(() => {
    return props.txConfig?.gas
      ? fromWei(bignumber(props.txConfig?.gas).mul(gas.get()).toFixed(0))
      : fromWei(value);
  }, [props.txConfig, value]);

  return (
    <div
      className={cn(
        'tw-flex tw-flex-row tw-mb-1 tw-justify-between tw-text-sov-white',
        props.className,
      )}
    >
      <div className="tw-w-1/2 tw-text-gray-10 tw-text-gray-10">
        {t(translations.marginTradePage.tradeForm.labels.tradingFee)}
      </div>
      <div className="tw-w-1/3 tw-font-medium">
        <LoadableValue
          value={
            <>
              {weiToNumberFormat(value, 5)} {props.symbol}
            </>
          }
          loading={loading}
          tooltip={
            <>
              {gasData} {props.symbol}
              <br />
              <small className="tw-text-gray-6">
                (gas price:{' '}
                {toNumberFormat(Number(fromWei(gasPrice, 'gwei')), 3)} gwei)
              </small>
              <br />
              <small className="tw-text-gray-6">
                (gas limit: {gasLimit} units)
              </small>
              {error && <p className="tw-text-warning">{error}</p>}
            </>
          }
        />
      </div>
    </div>
  );
}

TxFeeCalculator.defaultProps = {
  symbol: 'rBTC',
  config: {},
  condition: true,
};
