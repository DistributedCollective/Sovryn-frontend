import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { AssetValue } from 'app/components/AssetValue';
import { Icon } from 'app/components/Icon';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { translations } from 'locales/i18n';
import { Asset } from 'types';
import { toWei } from 'utils/blockchain/math-helpers';
import { LoadableValue } from 'app/components/LoadableValue';
import {
  StakeHistoryAction,
  StakeHistoryFieldsFragment,
} from 'utils/graphql/rsk/generated';
import { AssetValueMode } from 'app/components/AssetValue/types';
import { useDollarValue } from 'app/hooks/useDollarValue';
import { getActionName } from '../../utils';

interface IHistoryEventRowProps {
  event: StakeHistoryFieldsFragment;
}

export const HistoryEventRow: React.FC<IHistoryEventRowProps> = ({ event }) => {
  const { t } = useTranslation();
  const { timestamp, action, amount, transaction } = event;
  const stakeTime = useMemo(() => new Date(timestamp).getTime().toString(), [
    timestamp,
  ]);

  const dollarValue = useDollarValue(Asset.SOV, amount || '0');

  return (
    <tr>
      <td>
        <div className="tw-min-w-6">
          <DisplayDate timestamp={stakeTime} />
        </div>
      </td>
      <td>{t(getActionName(action))}</td>
      <td className="tw-text-left tw-font-normal">
        {action !== StakeHistoryAction.Delegate ? (
          <>
            <AssetValue
              asset={Asset.SOV}
              value={amount ? toWei(amount) : '-'}
              useTooltip={true}
              mode={AssetValueMode.auto}
              maxDecimals={8}
            />
            <br />≈{' '}
            <LoadableValue
              value={
                <AssetValue
                  value={Number(dollarValue.value)}
                  assetString="USD"
                />
              }
              loading={dollarValue.loading}
            />
          </>
        ) : (
          <>-</>
        )}
      </td>
      <td className="tw-text-left tw-hidden lg:tw-table-cell tw-font-normal tw-relative">
        <LinkToExplorer
          txHash={transaction.id}
          className="tw-m-0 tw-whitespace-nowrap"
          startLength={5}
          endLength={5}
        />
      </td>
      <td>
        <div className="tw-flex tw-items-center tw-justify-between lg:tw-w-5/6 tw-p-0">
          <div>
            <p className="tw-m-0">{t(translations.common.confirmed)}</p>
            <LinkToExplorer
              txHash={transaction.id}
              className="tw-m-0 tw-whitespace-nowrap"
              startLength={5}
              endLength={5}
            />
          </div>
          <Icon icon="success-tx" className="tw-text-success" size={28} />
        </div>
      </td>
    </tr>
  );
};
