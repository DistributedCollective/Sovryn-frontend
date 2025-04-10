import React from 'react';
// import { useTranslation } from 'react-i18next';
import type { TransactionConfig } from 'web3-core';
// import { translations } from 'locales/i18n';
import { ContractName } from '../../../../../utils/types/contracts';
// import classNames from 'classnames';
// import { TransactionFee } from './TransactionFee';
import { Asset } from 'types';

interface ITxFeeCalculatorProps {
  asset?: Asset;
  contractName: ContractName;
  methodName: string;
  args: any[];
  txConfig?: TransactionConfig;
  condition?: boolean;
  className?: string;
  textClassName?: string;
  onFeeUpdated?: (value: string) => void;
  customLimit?: number;
  customLoading?: boolean;
}

export const TxFeeCalculator: React.FC<ITxFeeCalculatorProps> = () => null;

// Temporary fix based on this bug report: https://sovryn.atlassian.net/browse/SOV-4870

// export const TxFeeCalculator: React.FC<ITxFeeCalculatorProps> = ({
//   asset = Asset.RBTC,
//   contractName,
//   methodName,
//   args,
//   txConfig = {},
//   condition = true,
//   className = 'tw-mb-1',
//   textClassName,
//   onFeeUpdated,
//   customLimit,
//   customLoading,
// }) => {
//   const { t } = useTranslation();
//   return (
//     <div
//       className={classNames(
//         'tw-flex tw-flex-row tw-justify-between tw-text-sov-white tw-items-center',
//         className,
//       )}
//     >
//       <div className="tw-w-1/2 tw-text-gray-10">
//         {t(translations.marginTradePage.tradeForm.labels.estimatedNetworkFee)}
//       </div>
//       <div
//         className={classNames(
//           'tw-w-1/2 tw-font-medium tw-pl-2 tw-text-right',
//           textClassName,
//         )}
//         data-action-id="margin-reviewTransaction-txFeeCalculator"
//       >
//         <TransactionFee
//           asset={asset}
//           contractName={contractName}
//           methodName={methodName}
//           args={args}
//           txConfig={txConfig}
//           condition={condition}
//           onFeeUpdated={onFeeUpdated}
//           customLimit={customLimit}
//           customLoading={customLoading}
//         />
//       </div>
//     </div>
//   );
// };
