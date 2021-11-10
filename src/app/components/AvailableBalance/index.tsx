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
import cn from 'classnames';
interface IAvailableBalanceProps {
  asset: Asset;
  className?: string;
  dataAttribute?: string;
}

export function AvailableBalance(props: IAvailableBalanceProps) {
  const { value, loading } = useAssetBalanceOf(props.asset);
  const asset = useMemo(() => AssetsDictionary.get(props.asset), [props.asset]);
  return (
    <div
      className={cn(
        props.className,
        'tw-truncate tw-text-xs tw-font-light tw-tracking-normal tw-flex tw-justify-between tw-mb-2 tw-w-full',
      )}
      data-action-id={props.dataAttribute}
    >
      <Trans
        i18nKey={translations.marginTradePage.tradeForm.labels.balance}
        components={[
          <LoadableValue
            value={
              <span
                data-action-id={props.dataAttribute}
                className="tw-font-semibold tw-ml-1"
              >
                {weiToNumberFormat(value, 6)}{' '}
                <AssetRenderer asset={asset.asset} />
              </span>
            }
            loading={loading}
            tooltip={
              <div className="tw-font-semibold">
                {fromWei(value)} <AssetRenderer asset={asset.asset} />
              </div>
            }
          />,
        ]}
      />
    </div>
  );
}
