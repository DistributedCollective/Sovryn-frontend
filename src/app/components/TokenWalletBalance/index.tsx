/**
 *
 * TokenWalletBalance
 *
 */
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Asset } from 'types/asset';
import { LoadableValue } from '../LoadableValue';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { useIsConnected } from 'app/hooks/useAccount';
import { useTokenBalanceOf } from '../../hooks/useTokenBalanceOf';
import { useWalletContext } from '@sovryn/react-wallet';

interface Props {
  asset: Asset;
  onBalance?: (value: string) => void;
}

export function TokenWalletBalance(props: Props) {
  const { connect } = useWalletContext();
  const { value, loading } = useTokenBalanceOf(props.asset);
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
            <LoadableValue value={weiToFixed(value, 4)} loading={loading} />
          </span>
        </div>
      )}
    </div>
  );
}
