import React from 'react';
import { Trans } from 'react-i18next';

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
  const { value, loading, error, gasPrice, gasLimit } = useEstimateContractGas(
    props.contractName,
    props.methodName,
    props.args,
    props.txConfig,
    props.condition,
  );
  const gasData = React.useMemo(() => {
    const data = props.txConfig?.gas
      ? bignumber(props.txConfig?.gas).mul(gas.get())
      : fromWei(value);
    return data;
  }, [props.txConfig, value]);

  return (
    <div
      className={cn(
        'tw-mb-10 tw-truncate tw-text-base tw-font-thin tw-tracking-normal',
        props.className,
      )}
    >
      <span className={props.textClassName}>
        <Trans
          i18nKey={translations.marginTradePage.tradeForm.labels.txFee}
          values={{ symbol: props.symbol }}
          components={[
            <LoadableValue
              value={weiToNumberFormat(value, 8)}
              loading={loading}
              tooltip={
                <>
                  {gasData} {props.symbol}
                  <br />
                  <small className="tw-text-muted">
                    (gas price:{' '}
                    {toNumberFormat(Number(fromWei(gasPrice, 'gwei')), 3)} gwei)
                  </small>
                  <br />
                  <small className="tw-text-muted">
                    (gas limit: {gasLimit} units)
                  </small>
                  {error && <p className="tw-text-red">{error}</p>}
                </>
              }
            />,
          ]}
        />
      </span>
    </div>
  );
}

TxFeeCalculator.defaultProps = {
  symbol: 'rBTC',
  config: {},
  condition: true,
};
