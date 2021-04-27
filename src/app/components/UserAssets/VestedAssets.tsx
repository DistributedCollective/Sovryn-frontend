import { bignumber } from 'mathjs';
/**
 *
 * UserAssets
 *
 */
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { translations } from '../../../locales/i18n';
import { Asset } from '../../../types/asset';
import { weiToFixed } from '../../../utils/blockchain/math-helpers';
import { ethGenesisAddress } from '../../../utils/classifiers';
import { AssetsDictionary } from '../../../utils/dictionaries/assets-dictionary';
import {
  numberToUSD,
  weiToNumberFormat,
} from '../../../utils/display-text/format';
import { AssetDetails } from '../../../utils/models/asset-details';
import { usePriceFeeds_tradingPairRates } from '../../hooks/price-feeds/usePriceFeeds_tradingPairRates';
import { useCachedAssetPrice } from '../../hooks/trading/useCachedAssetPrice';
import { useAccount, useIsConnected } from '../../hooks/useAccount';
import { LoadableValue } from '../LoadableValue';
import { Skeleton } from '../PageSkeleton';
import { useVestedStaking_balanceOf } from './useVestedStaking_balanceOf';
import { VestingDialog } from './VestingDialog';
import { ActionButton } from 'form/ActionButton';

export function VestedAssets() {
  const { t } = useTranslation();
  usePriceFeeds_tradingPairRates();
  const connected = useIsConnected();
  const account = useAccount();

  const item = AssetsDictionary.get(Asset.CSOV);
  const result = useVestedStaking_balanceOf(account);

  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState('');

  const onWithdraw = (contract: string) => {
    setOpen(true);
    setAddress(contract);
  };

  const onClose = () => {
    setOpen(false);
    setAddress('');
  };

  return (
    <>
      <div className="sovryn-border sovryn-table tw-pt-1 tw-pb-4 tw-pr-4 tw-pl-4 tw-mb-12">
        <table className="tw-w-full">
          <thead>
            <tr>
              <th>{t(translations.userAssets.tableHeaders.asset)}</th>
              <th className="tw-text-right">
                {t(translations.userAssets.tableHeaders.lockedAmount)}
              </th>
              <th className="text-right d-none d-md-table-cell">
                {t(translations.userAssets.tableHeaders.dollarBalance)}
              </th>
              <th className="text-right">
                {t(translations.userAssets.tableHeaders.action)}
              </th>
            </tr>
          </thead>
          <tbody className="tw-mt-12">
            {!connected && (
              <>
                <tr>
                  <td>
                    <Skeleton />
                  </td>
                  <td>
                    <Skeleton />
                  </td>
                  <td>
                    <Skeleton />
                  </td>
                  <td>
                    <Skeleton />
                  </td>
                </tr>
              </>
            )}
            {connected && account && (
              <>
                <AssetRow
                  item={item}
                  title="Genesis SOV"
                  value={result.vestedValue}
                  loading={result.loading}
                  contract={result.vestingContract}
                  onWithdraw={onWithdraw}
                />
                <AssetRow
                  item={item}
                  title="Origin SOV"
                  value={result.originVestedValue}
                  loading={result.loading}
                  contract={result.originVestingContract}
                  onWithdraw={onWithdraw}
                />
                {result.teamVestedValue !== '0' && (
                  <AssetRow
                    item={item}
                    title="Team SOV"
                    value={result.teamVestedValue}
                    loading={result.loading}
                    contract={result.teamVestingContract}
                    onWithdraw={onWithdraw}
                  />
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
      <VestingDialog address={address} onClose={onClose} isOpen={open} />
    </>
  );
}

interface AssetProps {
  item: AssetDetails;
  value: string;
  title: string;
  loading: boolean;
  contract: string;
  onWithdraw: (type: string) => void;
}

function AssetRow({
  item,
  value,
  title,
  loading,
  contract,
  onWithdraw,
}: AssetProps) {
  const { t } = useTranslation();
  const dollars = useCachedAssetPrice(item.asset, Asset.USDT);

  const dollarValue = useMemo(() => {
    if ([Asset.USDT, Asset.DOC].includes(item.asset)) {
      return value;
    } else {
      return bignumber(value)
        .mul(dollars.value)
        .div(10 ** item.decimals)
        .toFixed(0);
    }
  }, [dollars.value, value, item.asset, item.decimals]);

  return (
    <tr key={item.asset}>
      <td>
        <img
          className="tw-inline tw-mr-2"
          style={{ height: '40px' }}
          src={item.logoSvg}
          alt={item.asset}
        />{' '}
        {title}
      </td>
      <td className="tw-text-right">
        <LoadableValue value={weiToNumberFormat(value, 4)} loading={loading} />
      </td>
      <td className="tw-text-right">
        <LoadableValue
          value={numberToUSD(Number(weiToFixed(dollarValue, 4)), 4)}
          loading={dollars.loading}
        />
      </td>
      <td className="tw-text-right">
        <ActionButton
          className="tw-inline-block"
          text={t(translations.userAssets.actions.withdraw)}
          disabled={contract === ethGenesisAddress || loading}
          onClick={() => onWithdraw(contract)}
        />
      </td>
    </tr>
  );
}
