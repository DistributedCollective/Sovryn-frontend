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

interface Props {
  asset: Asset;
  dataAttribute?: string;
}

export function AvailableBalance(props: Props) {
  const { value, loading } = useAssetBalanceOf(props.asset);
  const asset = useMemo(() => AssetsDictionary.get(props.asset), [props.asset]);
  return (
    <div className="tw-mb-8 tw-truncate tw-text-xs tw-font-light tw-tracking-normal">
      <Trans
        i18nKey={translations.marginTradePage.tradeForm.labels.balance}
        components={[
          <LoadableValue
            value={
              <div data-action-id={props.dataAttribute}>
                {weiToNumberFormat(value, 6)}
              </div>
            }
            loading={loading}
            tooltip={
              <>
                {fromWei(value)} <AssetRenderer asset={asset.asset} />
              </>
            }
          />,
        ]}
      />
    </div>
  );
}
