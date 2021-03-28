/**
 *
 * TokenWalletBalance
 *
 */
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Asset } from 'types/asset';
import { LoadableValue } from '../LoadableValue';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { useIsConnected } from 'app/hooks/useAccount';
import { useTokenBalanceOf } from '../../hooks/useTokenBalanceOf';
import { Sovryn } from '../../../utils/sovryn';

interface Props {
  asset: Asset;
  onBalance?: (value: string) => void;
}

export function TokenWalletBalance(props: Props) {
  const { value, loading } = useTokenBalanceOf(props.asset);
  const { t } = useTranslation();

  const connected = useIsConnected();

  useEffect(() => {
    if (props.onBalance) {
      props.onBalance(value);
    }
  }, [props, value]);

  const doConnect = useCallback(() => {
    Sovryn.connect()
      .then(() => {})
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="font-weight-bold text-muted mb-2">
        {t(translations.assetWalletBalance.accountBalance)}
      </div>
      {!connected && (
        <button
          onClick={doConnect}
          className="bg-transparent btn-link text-white border-0 d-block text-left text-nowrap"
        >
          {t(translations.assetWalletBalance.connect)}
        </button>
      )}
      {connected && (
        <div className="d-flex flex-row justify-content-start align-items-center">
          <span className="text-muted">{props.asset}</span>
          <span className="text-white font-weight-bold ml-2">
            <LoadableValue value={weiToFixed(value, 4)} loading={loading} />
          </span>
        </div>
      )}
    </div>
  );
}
