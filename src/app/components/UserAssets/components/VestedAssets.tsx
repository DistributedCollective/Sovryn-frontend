import React, { useCallback, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useAccount, useIsConnected } from '../../../hooks/useAccount';
import { Skeleton } from '../../PageSkeleton';
import { useListOfUserVestings } from '../Vesting/useListOfUserVestings';
import { FullVesting } from '../Vesting/types';
import { VestedItem } from '../Vesting/VestedItem';
import { VestingWithdrawDialog } from '../Vesting/VestingWithdrawDialog';
import type { Nullable } from 'types';
import { useContractPauseState } from 'app/hooks/useContractPauseState';
import { AlertBadge } from '../../AlertBadge/AlertBadge';
import { discordInvite } from 'utils/classifiers';

export const VestedAssets: React.FC = () => {
  const { t } = useTranslation();
  const { frozen } = useContractPauseState('staking');
  const connected = useIsConnected();
  const account = useAccount();
  const { loading, items } = useListOfUserVestings();
  const [open, setOpen] = useState(false);
  const [vesting, setVesting] = useState<Nullable<FullVesting>>(null);

  const onWithdraw = useCallback((value: FullVesting) => {
    setOpen(true);
    setVesting(value);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
    setVesting(null);
  }, []);

  const isVestedLoaded = useMemo(
    () => connected && account && !loading && items.length > 0,
    [connected, account, loading, items.length],
  );

  return (
    <>
      {frozen && (
        <AlertBadge>
          <Trans
            i18nKey={translations.stake.paused}
            components={[
              <a href={discordInvite} target="_blank" rel="noreferrer nofollow">
                x
              </a>,
            ]}
          />
        </AlertBadge>
      )}
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
              <th className="tw-text-right"></th>
            </tr>
          </thead>
          <tbody className="tw-mt-12">
            {!connected || loading ? (
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
            ) : (
              <>
                {isVestedLoaded ? (
                  <>
                    {items.map(item => (
                      <VestedItem
                        key={item.vestingContract}
                        vesting={item}
                        onWithdraw={onWithdraw}
                        frozen={frozen}
                      />
                    ))}
                  </>
                ) : (
                  <tr>
                    <td className="tw-text-center" colSpan={99}>
                      {t(translations.userAssets.emptyVestTable)}
                    </td>
                  </tr>
                )}
              </>
            )}
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
};
