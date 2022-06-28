import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { AssetValue } from 'app/components/AssetValue';
import { Icon } from 'app/components/Icon';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { translations } from 'locales/i18n';
import { Asset } from 'types';
import { toWei } from 'utils/blockchain/math-helpers';
import { useCachedAssetPrice } from 'app/hooks/trading/useCachedAssetPrice';
import { bignumber } from 'mathjs';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { LoadableValue } from 'app/components/LoadableValue';
import { weiToUSD } from 'utils/display-text/format';
import {
  StakeHistoryAction,
  StakeHistoryFieldsFragment,
} from 'utils/graphql/rsk/generated';
import { AssetValueMode } from 'app/components/AssetValue/types';

interface IHistoryEventRowProps {
  event: StakeHistoryFieldsFragment;
}

export const HistoryEventRow: React.FC<IHistoryEventRowProps> = ({ event }) => {
  const { t } = useTranslation();
  const { timestamp, action, amount, transaction } = event;
  const stakeTime = useMemo(() => new Date(timestamp).getTime().toString(), [
    timestamp,
  ]);

  const dollars = useCachedAssetPrice(Asset.SOV, Asset.USDT);
  const SOV = AssetsDictionary.get(Asset.SOV);
  const dollarValue = useMemo(() => {
    if (!amount) return '';
    return bignumber(toWei(amount))
      .mul(dollars.value)
      .div(10 ** SOV.decimals)
      .toFixed(0);
  }, [dollars.value, amount, SOV.decimals]);

  const getActionName = (action: StakeHistoryAction) => {
    switch (action) {
      case StakeHistoryAction.Stake:
        return t(translations.stake.history.actions.stake);
      case StakeHistoryAction.Unstake:
        return t(translations.stake.history.actions.unstake);
      case StakeHistoryAction.FeeWithdrawn:
        return t(translations.stake.history.actions.feeWithdraw);
      case StakeHistoryAction.IncreaseStake:
        return t(translations.stake.history.actions.increase);
      case StakeHistoryAction.ExtendStake:
        return t(translations.stake.history.actions.extend);
      case StakeHistoryAction.Delegate:
        return t(translations.stake.history.actions.delegate);
      case StakeHistoryAction.WithdrawStaked:
        return t(translations.stake.history.actions.withdraw);
      default:
        return action;
    }
  };

  return (
    <tr>
      <td>
        <div className="tw-min-w-6">
          <DisplayDate timestamp={stakeTime} />
        </div>
      </td>
      <td>{getActionName(action)}</td>
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
              value={weiToUSD(dollarValue)}
              loading={dollars.loading}
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
