/**
 *
 * UserAssets
 *
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { useAccount, useIsConnected } from '../../hooks/useAccount';
import { AssetsDictionary } from '../../../utils/dictionaries/assets-dictionary';
import { AssetDetails } from '../../../utils/models/asset-details';
import { LoadableValue } from '../LoadableValue';
import { Asset } from '../../../types/asset';
import { usePriceFeeds_tradingPairRates } from '../../hooks/price-feeds/usePriceFeeds_tradingPairRates';
import { Skeleton } from '../PageSkeleton';
import { weiToNumberFormat } from '../../../utils/display-text/format';
import { useVestedStaking_balanceOf } from './useVestedStaking_balanceOf';

export function VestedAssets() {
  const { t } = useTranslation();
  usePriceFeeds_tradingPairRates();
  const connected = useIsConnected();
  const account = useAccount();

  const item = AssetsDictionary.get(Asset.CSOV);

  return (
    <>
      <div className="sovryn-border sovryn-table pt-1 pb-3 pr-3 pl-3 mb-5">
        <table className="w-100">
          <thead>
            <tr>
              <th>{t(translations.userAssets.tableHeaders.asset)}</th>
              <th className="text-right">
                {t(translations.userAssets.tableHeaders.lockedAmount)}
              </th>
            </tr>
          </thead>
          <tbody className="mt-5">
            {!connected && (
              <>
                <tr>
                  <td>
                    <Skeleton />
                  </td>
                  <td>
                    <Skeleton />
                  </td>
                </tr>
              </>
            )}
            {connected && account && <AssetRow key={item.asset} item={item} />}
          </tbody>
        </table>
      </div>
    </>
  );
}

interface AssetProps {
  item: AssetDetails;
}

function AssetRow({ item }: AssetProps) {
  const { value, loading } = useVestedStaking_balanceOf(useAccount());
  return (
    <tr key={item.asset}>
      <td>
        <img
          className="d-inline mr-2"
          style={{ height: '40px' }}
          src={item.logoSvg}
          alt={item.asset}
        />{' '}
        SOV
      </td>
      <td className="text-right">
        <LoadableValue value={weiToNumberFormat(value, 4)} loading={loading} />
      </td>
    </tr>
  );
}
