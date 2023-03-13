import React, { useCallback, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { Asset } from 'types';
import { Skeleton } from '../PageSkeleton';
import { useAccount, useIsConnected } from 'app/hooks/useAccount';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { Dialog } from 'app/containers/Dialog';
import { Button, ButtonSize, ButtonStyle } from '../Button';
import { discordInvite } from 'utils/classifiers';
import { ConversionDialog } from './components/ConversionDialog';
import { UnWrapDialog } from './components/UnWrapDialog';
import { TransakDialog } from '../TransakDialog/TransakDialog';
import { UserAssetsTableRow } from './components/UserAssetsTableRow';

export const UserAssets: React.FC = () => {
  const { t } = useTranslation();
  const connected = useIsConnected();
  const account = useAccount();
  const { checkMaintenances, States } = useMaintenance();
  const {
    [States.FASTBTC_SEND]: fastBtcSendLocked,
    [States.FASTBTC_RECEIVE]: fastBtcReceiveLocked,
    [States.TRANSAK]: transackLocked,
  } = checkMaintenances();

  const assets = useMemo(
    () =>
      AssetsDictionary.list().filter(
        item => ![Asset.CSOV].includes(item.asset),
      ),
    [],
  );

  const [transack, setTransack] = useState(false);
  const [conversionDialog, setConversionDialog] = useState(false);
  const [unwrapDialog, setUnwrapDialog] = useState(false);
  const [conversionToken, setConversionToken] = useState<Asset>(null!);

  const onConvertOpen = useCallback((asset: Asset) => {
    setConversionToken(asset);
    setConversionDialog(true);
  }, []);

  const onConvertClose = useCallback(() => {
    setConversionToken(null!);
    setConversionDialog(false);
  }, []);

  return (
    <>
      <div className="sovryn-border sovryn-table tw-pt-1 tw-pb-4 tw-pr-4 tw-pl-4 tw-mb-12 tw-overflow-auto">
        <table className="tw-w-full">
          <thead>
            <tr>
              <th>{t(translations.userAssets.tableHeaders.asset)}</th>
              <th className="tw-text-right">
                {t(translations.userAssets.tableHeaders.balance)}
              </th>
              <th className="tw-text-right tw-hidden md:tw-table-cell">
                {t(translations.stake.currentVests.dollarBalance)}
              </th>
              <th className="tw-text-right tw-hidden md:tw-table-cell"></th>
            </tr>
          </thead>
          <tbody className="tw-mt-12">
            {!connected && (
              <tr>
                <td>
                  <Skeleton />
                </td>
                <td>
                  <Skeleton />
                </td>
                <td className="tw-hidden md:tw-table-cell">
                  <Skeleton />
                </td>
                <td className="tw-hidden md:tw-table-cell">
                  <Skeleton />
                </td>
              </tr>
            )}
            {connected &&
              account &&
              assets.map(item => (
                <UserAssetsTableRow
                  key={item.asset}
                  item={item}
                  onTransack={() => setTransack(true)}
                  onConvert={onConvertOpen}
                  onUnWrap={() => setUnwrapDialog(true)}
                />
              ))}
          </tbody>
        </table>
      </div>
      <TransakDialog isOpen={transack} onClose={() => setTransack(false)} />
      <ConversionDialog
        isOpen={conversionDialog}
        asset={conversionToken}
        onClose={onConvertClose}
      />
      <UnWrapDialog
        isOpen={unwrapDialog}
        onClose={() => setUnwrapDialog(false)}
      />
      <Dialog
        isOpen={
          (fastBtcSendLocked && fastBtcReceiveLocked && transack) ||
          (transackLocked && transack)
        }
        onClose={() => setTransack(false)}
      >
        <div className="tw-mw-340 tw-mx-auto">
          <h1 className="tw-mb-6 tw-text-sov-white tw-text-center">
            {t(translations.common.maintenance)}
          </h1>
          <div className="tw-text-sm tw-font-normal tw-tracking-normal tw-text-center">
            <Trans
              i18nKey={translations.maintenance.transack}
              components={[
                <a
                  href={discordInvite}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="tw-underline hover:tw-no-underline"
                >
                  x
                </a>,
              ]}
            />
          </div>
          <div className="tw-text-center tw-mt-5">
            <Button
              text={t(translations.modal.close)}
              size={ButtonSize.lg}
              style={ButtonStyle.inverted}
              onClick={() => setTransack(false)}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};
