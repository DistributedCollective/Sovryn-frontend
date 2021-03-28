/**
 *
 * UserAssets
 *
 */
import React, { useState } from 'react';
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
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import { VestingDialog } from './VestingDialog';
import { ethGenesisAddress } from '../../../utils/classifiers';

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
      <div className="sovryn-border sovryn-table pt-1 pb-3 pr-3 pl-3 mb-5">
        <table className="w-100">
          <thead>
            <tr>
              <th>{t(translations.userAssets.tableHeaders.asset)}</th>
              <th className="text-right">
                {t(translations.userAssets.tableHeaders.lockedAmount)}
              </th>
              <th className="text-right">
                {t(translations.userAssets.tableHeaders.action)}
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
  return (
    <tr key={item.asset}>
      <td>
        <img
          className="d-inline mr-2"
          style={{ height: '40px' }}
          src={item.logoSvg}
          alt={item.asset}
        />{' '}
        {title}
      </td>
      <td className="text-right">
        <LoadableValue value={weiToNumberFormat(value, 4)} loading={loading} />
      </td>
      <td className="text-right">
        <Button
          minimal
          text={t(translations.userAssets.actions.withdraw)}
          className="text-gold button-round"
          disabled={contract === ethGenesisAddress || loading}
          onClick={() => onWithdraw(contract)}
        />
      </td>
    </tr>
  );
}
