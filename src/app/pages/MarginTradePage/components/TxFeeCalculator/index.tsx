import React from 'react';
import { Trans } from 'react-i18next';
import type { TransactionConfig } from 'web3-core';
import { translations } from 'locales/i18n';
import { fromWei } from 'utils/blockchain/math-helpers';
import { LoadableValue } from '../../../../components/LoadableValue';
import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { ContractName } from '../../../../../utils/types/contracts';
import { useEstimateContractGas } from '../../../../hooks/useEstimateGas';

interface Props {
  symbol?: string;
  contractName: ContractName;
  methodName: string;
  args: any[];
  txConfig?: TransactionConfig;
  condition?: boolean;
}

export function TxFeeCalculator(props: Props) {
  const { value, loading } = useEstimateContractGas(
    props.contractName,
    props.methodName,
    props.args,
    props.txConfig,
    props.condition,
  );

  return (
    <div className="tw-mb-8 tw-truncate">
      <Trans
        i18nKey={translations.marginTradePage.tradeForm.labels.txFee}
        values={{ symbol: props.symbol }}
        components={[
          <LoadableValue
            value={weiToNumberFormat(value, 6)}
            loading={loading}
            tooltip={fromWei(value)}
          />,
        ]}
      />
    </div>
  );
}

TxFeeCalculator.defaultProps = {
  symbol: 'rBTC',
  config: {},
  condition: true,
};
