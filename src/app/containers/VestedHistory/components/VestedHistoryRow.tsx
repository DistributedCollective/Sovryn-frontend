import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { LoadableValue } from 'app/components/LoadableValue';
import { Asset } from 'types/asset';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { Icon } from 'app/components/Icon';
import {
  VestedHistoryFieldsFragment,
  VestingContractType,
} from 'utils/graphql/rsk/generated';
import { useDollarValue } from 'app/hooks/useDollarValue';
import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { AssetValue } from 'app/components/AssetValue';
import { AssetValueMode } from 'app/components/AssetValue/types';
import { getAsset } from '../utils';

interface IVestedHistoryRowProps {
  event: VestedHistoryFieldsFragment;
  type: VestingContractType;
}

export const VestedHistoryRow: React.FC<IVestedHistoryRowProps> = ({
  event,
  type,
}) => {
  const { t } = useTranslation();
  const { timestamp, amount, transaction } = event;
  const stakeTime = useMemo(() => new Date(timestamp).getTime().toString(), [
    timestamp,
  ]);
  const dollarValue = useDollarValue(getAsset(type).asset, amount || '0');

  return (
    <tr>
      <td>
        <DisplayDate timestamp={stakeTime} />
      </td>
      <td className="tw-text-left tw-font-normal tw-tracking-normal">
        <div className="assetname tw-flex tw-items-center">
          <div>
            <img
              src={getAsset(type).logoSvg}
              className="tw-mr-3"
              alt={getAsset(type).name}
            />
          </div>
          <div className="tw-text-sm tw-font-normal tw-hidden xl:tw-block tw-pl-3">
            {type}
          </div>
        </div>
      </td>
      <td className="tw-text-left tw-font-normal tw-tracking-normal">
        <AssetValue
          asset={getAsset(type).asset}
          value={Number(amount)}
          useTooltip
          mode={AssetValueMode.auto}
          maxDecimals={8}
        />
        <br />≈{' '}
        <LoadableValue
          value={
            <AssetValue value={Number(dollarValue.value)} assetString="USD" />
          }
          loading={dollarValue.loading}
        />
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
