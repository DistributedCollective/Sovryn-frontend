/**
 *
 * AssetWalletBalance
 *
 */
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Asset } from 'types/asset';
import { weiTo18, weiToFixed } from 'utils/blockchain/math-helpers';
import { useAssetBalanceOf } from 'app/hooks/useAssetBalanceOf';
import { useIsConnected } from 'app/hooks/useAccount';
import { translations } from 'locales/i18n';
import { LoadableValue } from '../LoadableValue';
import { useWalletContext } from '@sovryn/react-wallet';
import { AssetRenderer } from '../CurrencyAsset';

interface Props {
  asset: Asset;
  onBalance?: (value: string) => void;
}

export function AssetWalletBalance(props: Props) {
  const { connect } = useWalletContext();
  const { value, loading } = useAssetBalanceOf(props.asset);
  const { t } = useTranslation();
  const connected = useIsConnected();

  useEffect(() => {
    if (props.onBalance) {
      props.onBalance(value);
    }
  }, [props, value]);

  return (
    <div>
      <div className="tw-font-bold tw-text-muted tw-mb-2">
        {t(translations.assetWalletBalance.accountBalance)}
      </div>
      {!connected && (
        <button
          onClick={() => connect()}
          className="bg-transparent btn-link text-white border-0 d-block text-left text-nowrap"
        >
          {t(translations.assetWalletBalance.connect)}
        </button>
      )}
      {connected && (
        <div className="tw-flex tw-flex-row tw-justify-start tw-items-center">
          <span className="tw-text-muted">{props.asset}</span>
          <span className="tw-text-white tw-font-bold tw-ml-2">
            <LoadableValue
              value={weiToFixed(value, 4)}
              loading={loading}
              tooltip={<>{weiTo18(value)}</>}
            />
          </span>
        </div>
      )}
    </div>
  );
}

export function AssetWalletBalanceInline(props: Props) {
  const { value, loading } = useAssetBalanceOf(props.asset);
  const { t } = useTranslation();

  useEffect(() => {
    if (props.onBalance) {
      props.onBalance(value);
    }
  }, [props, value]);

  return (
    <div>
      {t(translations.buySovPage.form.availableBalance)}{' '}
      <LoadableValue
        loading={loading}
        value={weiToFixed(value, 4)}
        tooltip={weiTo18(value)}
      />{' '}
      <AssetRenderer asset={Asset.RBTC} />
    </div>
  );
}
