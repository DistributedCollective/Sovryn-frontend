import React, { useMemo } from 'react';
import { Trans } from 'react-i18next';
import { Asset } from 'types/asset';
import { translations } from 'locales/i18n';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { fromWei } from 'utils/blockchain/math-helpers';
import { weiToNumberFormat } from 'utils/display-text/format';
import { useAssetBalanceOf } from 'app/hooks/useAssetBalanceOf';
import { LoadableValue } from '../LoadableValue';

interface Props {
  asset: Asset;
}

export function AvailableBalance(props: Props) {
  const { value, loading } = useAssetBalanceOf(props.asset);
  const asset = useMemo(() => AssetsDictionary.get(props.asset), [props.asset]);
  return (
    <div className="tw-mb-8 tw-truncate">
      <Trans
        i18nKey={translations.marginTradePage.tradeForm.labels.balance}
        values={{ symbol: asset.symbol }}
        components={[
          <LoadableValue
            value={weiToNumberFormat(value, 6)}
            loading={loading}
            tooltip={fromWei(value)}
          />,
        ]}
      />
    </div>
  );
}
