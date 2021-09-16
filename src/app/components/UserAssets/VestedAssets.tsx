import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { useAccount, useIsConnected } from '../../hooks/useAccount';
import { Skeleton } from '../PageSkeleton';
import {
  FullVesting,
  useListOfUserVestings,
} from './Vesting/useListOfUserVestings';
import VestedItem from './Vesting/VestedItem';
import { VestingWithdrawDialog } from './Vesting/VestingWithdrawDialog';

export function VestedAssets() {
  const { t } = useTranslation();
  const connected = useIsConnected();
  const account = useAccount();

  const { loading, items } = useListOfUserVestings();

  const [open, setOpen] = useState(false);
  const [vesting, setVesting] = useState<FullVesting>(null!);

  const onWithdraw = (value: FullVesting) => {
    setOpen(true);
    setVesting(value);
  };

  const onClose = () => {
    setOpen(false);
    setVesting(null!);
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
              <th className="tw-text-right tw-hidden md:tw-table-cell">
                {t(translations.userAssets.tableHeaders.dollarBalance)}
              </th>
              <th className="tw-text-right">
                {t(translations.userAssets.tableHeaders.action)}
              </th>
            </tr>
          </thead>
          <tbody className="tw-mt-12">
            {(!connected || loading) && (
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
            {connected &&
              account &&
              !loading &&
              (items.length ? (
                <>
                  {items.map(item => (
                    <VestedItem
                      key={item.vestingContract}
                      vesting={item}
                      onWithdraw={onWithdraw}
                    />
                  ))}
                  {/*{result.vestedValue !== '0' && (*/}
                  {/*  <AssetRow*/}
                  {/*    item={item}*/}
                  {/*    title="Genesis SOV"*/}
                  {/*    value={result.vestedValue}*/}
                  {/*    loading={result.loading}*/}
                  {/*    contract={result.vestingContract}*/}
                  {/*    onWithdraw={onWithdraw}*/}
                  {/*  />*/}
                  {/*)}*/}

                  {/*{result.originVestedValue !== '0' && (*/}
                  {/*  <AssetRow*/}
                  {/*    item={item}*/}
                  {/*    title="Origins SOV"*/}
                  {/*    value={result.originVestedValue}*/}
                  {/*    loading={result.loading}*/}
                  {/*    contract={result.originVestingContract}*/}
                  {/*    onWithdraw={onWithdraw}*/}
                  {/*  />*/}
                  {/*)}*/}

                  {/*{result.teamVestedValue !== '0' && (*/}
                  {/*  <AssetRow*/}
                  {/*    item={item}*/}
                  {/*    title="Team SOV"*/}
                  {/*    value={result.teamVestedValue}*/}
                  {/*    loading={result.loading}*/}
                  {/*    contract={result.teamVestingContract}*/}
                  {/*    onWithdraw={onWithdraw}*/}
                  {/*  />*/}
                  {/*)}*/}
                  {/*{result.lmVestingContract !== ethGenesisAddress && (*/}
                  {/*  <AssetRow*/}
                  {/*    item={item}*/}
                  {/*    title="Reward SOV"*/}
                  {/*    value={result.lmVestedValue}*/}
                  {/*    loading={result.loading}*/}
                  {/*    contract={result.lmVestingContract}*/}
                  {/*    onWithdraw={onWithdraw}*/}
                  {/*  />*/}
                  {/*)}*/}
                  {/*{result.babelFishVestedValue !== '0' && (*/}
                  {/*  <OriginsSaleRow*/}
                  {/*    token="FISH"*/}
                  {/*    value={result.babelFishVestedValue}*/}
                  {/*    title="Origins FISH"*/}
                  {/*    logo={babelfishLogo}*/}
                  {/*    loading={result.loading}*/}
                  {/*  />*/}
                  {/*)}*/}
                </>
              ) : (
                <tr>
                  <td className="tw-text-center" colSpan={99}>
                    {t(translations.userAssets.emptyVestTable)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <VestingWithdrawDialog
        vesting={vesting}
        isOpen={open}
        onClose={onClose}
      />
    </>
  );
}
