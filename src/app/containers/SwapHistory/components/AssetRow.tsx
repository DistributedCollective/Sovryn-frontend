import React from 'react';
import { useTranslation } from 'react-i18next';

import { LinkToExplorer } from 'app/components/LinkToExplorer';
import iconPending from 'assets/images/icon-pending.svg';
import iconRejected from 'assets/images/icon-rejected.svg';
import iconSuccess from 'assets/images/icon-success.svg';
import { TxStatus } from 'store/global/transactions-store/types';
import { AssetDetails } from 'utils/models/asset-details';

import { translations } from '../../../../locales/i18n';
import { Asset } from '../../../../types';
import { DisplayDate } from '../../../components/ActiveUserLoanContainer/components/DisplayDate';
import { AssetRenderer } from '../../../components/AssetRenderer';
import { LoadableValue } from '../../../components/LoadableValue';
import { useCachedAssetPrice } from '../../../hooks/trading/useCachedAssetPrice';
import { Nullable } from 'types';
import { toNumberFormat } from 'utils/display-text/format';
import { useDollarValue } from 'app/hooks/useDollarValue';
import { AssetValue } from 'app/components/AssetValue';
import { AssetValueMode } from 'app/components/AssetValue/types';

export interface IAssetRowData {
  status?: TxStatus;
  timestamp: number;
  transactionHash: string;
  fromAmount: string;
  toAmount: Nullable<string>;
}

interface IAssetProps {
  data: IAssetRowData;
  itemFrom: AssetDetails;
  itemTo: AssetDetails;
}

export const AssetRow: React.FC<IAssetProps> = ({ data, itemFrom, itemTo }) => {
  const { t } = useTranslation();
  const dollars = useCachedAssetPrice(itemTo.asset, Asset.USDT);
  const dollarValue = useDollarValue(itemTo.asset, data.toAmount!);

  return (
    <tr>
      <td className="tw-hidden lg:tw-table-cell">
        <DisplayDate
          timestamp={new Date(data.timestamp).getTime().toString()}
        />
      </td>
      <td className="tw-hidden lg:tw-table-cell">
        <img
          className="tw-hidden lg:tw-inline tw-mr-1"
          style={{ height: '29px' }}
          src={itemFrom.logoSvg}
          alt={itemFrom.asset}
        />{' '}
        <AssetRenderer asset={itemFrom.asset} />
      </td>
      <td>
        <AssetValue
          value={Number(data.fromAmount)}
          maxDecimals={8}
          mode={AssetValueMode.auto}
          asset={itemFrom.asset}
        />
      </td>
      <td>
        <img
          className="lg:tw-inline tw-mr-1"
          style={{ height: '29px' }}
          src={itemTo.logoSvg}
          alt={itemTo.asset}
        />{' '}
        <AssetRenderer asset={itemTo.asset} />
      </td>
      <td className="tw-hidden lg:tw-table-cell">
        <div>
          <AssetValue
            value={Number(data.toAmount)}
            maxDecimals={8}
            mode={AssetValueMode.auto}
            asset={itemTo.asset}
          />
        </div>
        ≈{' '}
        <LoadableValue
          value={`USD ${toNumberFormat(dollarValue.value, 2)}`}
          loading={dollars.loading}
        />
      </td>
      <td className="sm:tw-w-48">
        <div className="tw-flex tw-items-center tw-justify-between tw-p-0">
          <div>
            {!data.status && (
              <p className="tw-m-0">{t(translations.common.confirmed)}</p>
            )}
            {data.status === TxStatus.FAILED && (
              <p className="tw-m-0">{t(translations.common.failed)}</p>
            )}
            {data.status === TxStatus.PENDING && (
              <p className="tw-m-0">{t(translations.common.pending)}</p>
            )}
            <LinkToExplorer
              txHash={data.transactionHash}
              className="tw-text-primary tw-font-normal tw-whitespace-nowrap"
              startLength={5}
              endLength={5}
            />
          </div>
          <div className="tw-hidden sm:tw-block lg:tw-hidden xl:tw-block">
            {!data.status && (
              <img
                src={iconSuccess}
                title={t(translations.common.confirmed)}
                alt={t(translations.common.confirmed)}
              />
            )}
            {data.status === TxStatus.FAILED && (
              <img
                src={iconRejected}
                title={t(translations.common.failed)}
                alt={t(translations.common.failed)}
              />
            )}
            {data.status === TxStatus.PENDING && (
              <img
                className="tw-animate-spin"
                src={iconPending}
                title={t(translations.common.pending)}
                alt={t(translations.common.pending)}
              />
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};
