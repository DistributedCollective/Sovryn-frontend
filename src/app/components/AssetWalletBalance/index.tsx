/**
 *
 * AssetWalletBalance
 *
 */
import React, { useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Asset } from 'types/asset';
import { weiTo18, weiToFixedAsset } from 'utils/blockchain/math-helpers';
import { useAssetBalanceOf } from 'app/hooks/useAssetBalanceOf';
import { useBlockSync, useIsConnected } from 'app/hooks/useAccount';
import { translations } from 'locales/i18n';
import { LoadableValue } from '../LoadableValue';
import { WalletContext } from '@sovryn/react-wallet';
import { AssetRenderer } from '../AssetRenderer';

interface Props {
  asset: Asset;
  onBalance?: (value: string) => void;
}

/**
 * @deprecated
 * @param props
 * @constructor
 */
export function AssetWalletBalance(props: Props) {
  const { connect } = useContext(WalletContext);
  const { value, loading } = useAssetBalanceOf(props.asset);
  const { t } = useTranslation();
  const connected = useIsConnected();
  const blockSync = useBlockSync();

  useEffect(() => {
    if (props.onBalance) {
      props.onBalance(value);
    }
  }, [props, value, blockSync]);

  return (
    <div>
      <div className="tw-font-bold tw-text-gray-6 tw-mb-2">
        {t(translations.assetWalletBalance.accountBalance)}
      </div>
      {!connected && (
        <button
          onClick={() => connect()}
          className="tw-bg-transparent tw-text-sov-white tw-border-0 tw-block tw-text-left tw-whitespace-nowrap hover:tw-underline"
        >
          {t(translations.assetWalletBalance.connect)}
        </button>
      )}
      {connected && (
        <div className="tw-flex tw-flex-row tw-justify-start tw-items-center">
          <span className="tw-text-gray-6">
            <AssetRenderer asset={props.asset} />
          </span>
          <span className="tw-text-sov-white tw-font-bold tw-ml-2">
            <LoadableValue
              value={weiToFixedAsset(value, props.asset, 4)}
              loading={loading}
              tooltip={<>{weiTo18(value)}</>}
            />
          </span>
        </div>
      )}
    </div>
  );
}
