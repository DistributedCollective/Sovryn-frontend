import React from 'react';
import dayjs from 'dayjs';

import { ReactComponent as IconDeposit } from 'assets/images/fastbtc-deposit.svg';
import { ReactComponent as IconWithdraw } from 'assets/images/fastbtc-withdraw.svg';
import { ReactComponent as IconTransfer } from 'assets/images/fastbtc-transfer.svg';
import iconSuccess from 'assets/images/icon-success.svg';
import iconRejected from 'assets/images/icon-rejected.svg';
import iconPending from 'assets/images/icon-pending.svg';

import { weiToNumberFormat } from '../../../../../utils/display-text/format';
import { AssetsDictionary } from '../../../../../utils/dictionaries/assets-dictionary';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { Transaction, TxStatus } from 'store/global/transactions-store/types';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../locales/i18n';
import { AssetValue } from '../../../../components/AssetValue';
import {
  FundingHistoryAction,
  FundingHistoryEntry,
  FundingHistoryStatus,
} from '../../hooks/usePerpetual_FundingHistory';

const ActionIcons = {
  [FundingHistoryAction.deposit]: <IconDeposit className="tw-h-6" />,
  [FundingHistoryAction.withdraw]: <IconWithdraw className="tw-h-6" />,
  [FundingHistoryAction.transfer]: <IconTransfer className="tw-h-6" />,
};

const StatusIcons = {
  [FundingHistoryStatus.pending]: (
    <img className="tw-h-6" src={iconPending} title="Pending" alt="Pending" />
  ),
  [FundingHistoryStatus.complete]: (
    <img
      className="tw-h-6"
      src={iconSuccess}
      title="Confirmed"
      alt="Confirmed"
    />
  ),
  [FundingHistoryStatus.confirmed]: (
    <img
      className="tw-h-6"
      src={iconSuccess}
      title="Confirmed"
      alt="Confirmed"
    />
  ),
  [FundingHistoryStatus.failed]: (
    <img className="tw-h-6" src={iconRejected} title="Failed" alt="Failed" />
  ),
};

export const AccountFundingHistoryRow: React.FC<FundingHistoryEntry> = ({
  action,
  time,
  amount,
  status,
  transactionHash,
}) => {
  const { t } = useTranslation();

  return (
    <tr className="tw-h-auto">
      <td className="tw-py-2">
        <div className="tw-flex tw-flex-row tw-items-center">
          {ActionIcons[action]}
          <span>{t(translations.perpetualPage.accountBalance[action])}</span>
        </div>
      </td>
      <td>{dayjs.tz(time, 'UTC').tz(dayjs.tz.guess()).format('L - LTS Z')}</td>
      <td className={'tw-text-right'}>
        <AssetValue value={amount} />
      </td>
      <td>
        <LinkToExplorer
          txHash={transactionHash}
          className="tw-text-primary tw-font-normal tw-whitespace-nowrap"
        />
      </td>
      <td>
        <div className="tw-flex tw-flex-row tw-justify-between tw-items-center">
          <span>{t(translations.common[status])}</span>
          {StatusIcons[status]}
        </div>
      </td>
    </tr>
  );
};
