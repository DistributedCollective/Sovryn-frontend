import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        'tw-flex tw-flex-row tw-mb-1 tw-justify-between tw-text-sov-white',
        className,
      )}
    >
      <div className="tw-w-1/2 tw-text-gray-10 tw-text-gray-10">
        {t(translations.marginTradePage.tradeForm.labels.tradingFee)}
      </div>
      <div className="tw-w-1/3 tw-font-medium">
        <TransactionFee
          asset={asset}
          contractName={contractName}
          methodName={methodName}
          args={args}
          txConfig={txConfig}
          condition={condition}
        />
      </div>
    </div>
  );
};
