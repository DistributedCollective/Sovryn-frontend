import dayjs from 'dayjs';
import { bignumber } from 'mathjs';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import logoSvg from 'assets/images/tokens/sov.svg';
import { translations } from 'locales/i18n';
import { TxStatus } from 'store/global/transactions-store/types';
import { useCachedAssetPrice } from 'app/hooks/trading/useCachedAssetPrice';
import { weiToUSD } from 'utils/display-text/format';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { LoadableValue } from 'app/components/LoadableValue';
import { numberFromWei } from 'utils/blockchain/math-helpers';
import { Asset } from 'types/asset';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { Icon } from 'app/components/Icon';

interface IVestedHistoryTableRow {
  item: any;
}

export const VestedHistoryTableRow: React.FC<IVestedHistoryTableRow> = ({
  item,
}) => {
  const { t } = useTranslation();
  const SOV = AssetsDictionary.get(Asset.SOV);
  const dollars = useCachedAssetPrice(Asset.SOV, Asset.USDT);
  const dollarValue = useMemo(() => {
    if (item.returnVal.amount === undefined) return '';
    return bignumber(item.returnVal.amount)
      .mul(dollars.value)
      .div(10 ** SOV.decimals)
      .toFixed(0);
  }, [dollars.value, item.returnVal.amount, SOV.decimals]);
  return (
    <tr>
      <td>
        {dayjs
          .tz(item.eventDate, 'UTC')
          .tz(dayjs.tz.guess())
          .format('L - LTS Z')}
      </td>
      <td className="tw-text-left tw-font-normal tw-tracking-normal">
        <div className="assetname tw-flex tw-items-center">
          <div>
            <img src={logoSvg} className="tw-mr-3" alt="sov" />
          </div>
          <div className="tw-text-sm tw-font-normal tw-hidden xl:tw-block tw-pl-3">
            {item.type}
          </div>
        </div>
      </td>
      <td className="tw-text-left tw-font-normal tw-tracking-normal">
        {numberFromWei(item.returnValues.amount)} {t(translations.stake.sov)}
        <br />≈{' '}
        <LoadableValue
          value={weiToUSD(dollarValue)}
          loading={dollars.loading}
        />
      </td>
      <td className="tw-text-left tw-hidden lg:tw-table-cell tw-font-normal tw-relative">
        <LinkToExplorer
          txHash={item.transactionHash}
          startLength={6}
          className="tw-text-secondary hover:tw-underline"
        />
      </td>
      <td>
        <div className="tw-flex tw-items-center tw-justify-between lg:tw-w-5/6 tw-p-0">
          <div>
            {!item.status && (
              <p className="tw-m-0">{t(translations.common.confirmed)}</p>
            )}
            {item.status === TxStatus.FAILED && (
              <p className="tw-m-0">{t(translations.common.failed)}</p>
            )}
            {item.status === TxStatus.PENDING && (
              <p className="tw-m-0">{t(translations.common.pending)}</p>
            )}
            <LinkToExplorer
              txHash={item.transaction_hash}
              className="tw-text-primary tw-font-normal tw-text-nowrap"
            />
          </div>
          <div>
            {!item.status && (
              <Icon icon="success-tx" size={25} className="tw-text-success" />
            )}
            {item.status === TxStatus.FAILED && (
              <Icon icon="failed-tx" size={25} className="tw-text-warning" />
            )}
            {item.status === TxStatus.PENDING && (
              <Icon icon="pending-tx" size={25} className="tw-text-sov-white" />
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};
