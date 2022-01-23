import React, { useMemo } from 'react';
import { Trans } from 'react-i18next';
import { Asset } from 'types/asset';
import { translations } from 'locales/i18n';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { fromWei } from 'utils/blockchain/math-helpers';
import { weiToNumberFormat } from 'utils/display-text/format';
import { useAssetBalanceOf } from 'app/hooks/useAssetBalanceOf';
import { LoadableValue } from '../LoadableValue';
import { AssetRenderer } from '../AssetRenderer';
import classNames from 'classnames';
interface IAvailableBalanceProps {
  asset: Asset;
  className?: string;
  dataAttribute?: string;
}

export const AvailableBalance: React.FC<IAvailableBalanceProps> = ({
  asset,
  className,
  dataAttribute,
}) => {
  const { value, loading } = useAssetBalanceOf(asset);
  const assetDetails = useMemo(() => AssetsDictionary.get(asset), [asset]);
  return (
    <div
      className={classNames(
        className,
        'tw-truncate tw-text-xs tw-font-light tw-tracking-normal tw-flex tw-w-full',
        {
          'tw-justify-between tw-mb-2': !className,
        },
      )}
      data-action-id={dataAttribute}
    >
      <Trans
        i18nKey={translations.marginTradePage.tradeForm.labels.balance}
        components={[
          <LoadableValue
            value={
              <span
                data-action-id={dataAttribute}
                className="tw-font-semibold tw-ml-1"
              >
                {weiToNumberFormat(value, 6)}{' '}
                <AssetRenderer asset={assetDetails.asset} />
              </span>
            }
            loading={loading}
            tooltip={
              <div className="tw-font-semibold">
                {fromWei(value)} <AssetRenderer asset={assetDetails.asset} />
              </div>
            }
          />,
        ]}
      />
    </div>
  );
};
