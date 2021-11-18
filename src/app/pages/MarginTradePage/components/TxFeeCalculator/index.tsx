import React from 'react';
import { Trans } from 'react-i18next';

import type { TransactionConfig } from 'web3-core';
import { translations } from 'locales/i18n';
import { ContractName } from '../../../../../utils/types/contracts';
import cn from 'classnames';
import { TransactionFee } from './TransactionFee';
import { Asset } from 'types';

interface ITxFeeCalculator {
  asset?: Asset;
  contractName: ContractName;
  methodName: string;
  args: any[];
  txConfig?: TransactionConfig;
  condition?: boolean;
  className?: string;
  textClassName?: string;
}

export const TxFeeCalculator: React.FC<ITxFeeCalculator> = ({
  asset = Asset.RBTC,
  contractName,
  methodName,
  args,
  txConfig = {},
  condition = true,
  className,
  textClassName,
}) => {
  return (
    <div
      className={cn(
        'tw-mb-8 tw-truncate tw-text-sm tw-font-thin tw-tracking-normal',
        className,
      )}
    >
      <span className={textClassName}>
        <Trans
          i18nKey={translations.marginTradePage.tradeForm.labels.txFee}
          components={[
            <TransactionFee
              asset={asset}
              contractName={contractName}
              methodName={methodName}
              args={args}
              txConfig={txConfig}
              condition={condition}
            />,
          ]}
        />
      </span>
    </div>
  );
};
