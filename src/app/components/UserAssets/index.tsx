import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { Asset } from 'types';
import { Skeleton } from '../PageSkeleton';
import { useAccount, useIsConnected } from 'app/hooks/useAccount';
import { ConversionDialog } from './components/ConversionDialog';
import { UnWrapDialog } from './components/UnWrapDialog';
import { UserAssetsTableRow } from './components/UserAssetsTableRow';

export const UserAssets: React.FC = () => {
  const { t } = useTranslation();
  const connected = useIsConnected();
  const account = useAccount();

  const assets = useMemo(
    () =>
      AssetsDictionary.list().filter(
        item => ![Asset.CSOV].includes(item.asset),
      ),
    [],
  );

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
                  onConvert={onConvertOpen}
                  onUnWrap={() => setUnwrapDialog(true)}
                />
              ))}
          </tbody>
        </table>
      </div>
      <ConversionDialog
        isOpen={conversionDialog}
        asset={conversionToken}
        onClose={onConvertClose}
      />
      <UnWrapDialog
        isOpen={unwrapDialog}
        onClose={() => setUnwrapDialog(false)}
      />
    </>
  );
};
