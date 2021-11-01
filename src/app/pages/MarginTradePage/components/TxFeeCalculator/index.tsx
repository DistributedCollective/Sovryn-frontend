import React from 'react';
import cn from 'classnames';
import { Trans } from 'react-i18next';
import type { TransactionConfig } from 'web3-core';
import { translations } from 'locales/i18n';
import { ContractName } from '../../../../../utils/types/contracts';
import { TransactionFee } from './TransactionFee';
import { Asset } from 'types';
interface Props {
  asset?: Asset;
  contractName: ContractName;
  methodName: string;
  args: any[];
  txConfig?: TransactionConfig;
  condition?: boolean;
  className?: string;
  textClassName?: string;
}

export function TxFeeCalculator(props: Props) {
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
          components={[<TransactionFee {...props} />]}
        />
      </span>
    </div>
  );
}

TxFeeCalculator.defaultProps = {
  asset: Asset.RBTC,
  config: {},
  condition: true,
};
