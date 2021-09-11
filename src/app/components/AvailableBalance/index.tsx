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
}

export function AvailableBalance(props: Props) {
  const { value, loading } = useAssetBalanceOf(props.asset);
  const asset = useMemo(() => AssetsDictionary.get(props.asset), [props.asset]);
  return (
    <div className="tw-truncate tw-text-xs tw-font-light tw-tracking-normal tw-flex tw-justify-between tw-mb-2">
      <Trans
        i18nKey={translations.marginTradePage.tradeForm.labels.balance}
        components={[
          <LoadableValue
            value={
              <>
                {weiToNumberFormat(value, 6)} {asset.asset}
              </>
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
