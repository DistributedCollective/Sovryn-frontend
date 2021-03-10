/**
 *
 * ConnectWalletButton
 *
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as blockies from 'blockies-ts';
import { useInjectSaga } from 'utils/redux-injectors';
import { connectWalletButtonSaga } from './saga';
import { Button } from '@blueprintjs/core';
import { Sovryn } from '../../../utils/sovryn';
import { prettyTx } from '../../../utils/helpers';
import { useAccount, useIsConnected } from '../../hooks/useAccount';
import { translations } from 'locales/i18n';

export function ConnectWalletButton() {
  useInjectSaga({ key: 'connectWalletButton', saga: connectWalletButtonSaga });

  const { t } = useTranslation();
  const connected = useIsConnected();
  const address = useAccount();
  const [imgSrc, setImgSrc] = useState<string>(null as any);

  const handleWalletConnection = useCallback(() => {
    Sovryn.connect()
      .then(() => {})
      .catch(console.error);
  }, []);

  const handleDisconnect = () => {
    Sovryn.disconnect();
  };

  useEffect(() => {
    if (address) {
      setImgSrc(
        blockies
          .create({
            seed: address.toLowerCase(),
            size: 6,
          })
          .toDataURL(),
      );
    }
  }, [address]);

  return (
    <div className="tw-flex tw-flex-row tw-justify-end tw-mb-4">
      <div>
        {connected && (
          <div className="tw-flex tw-flex-row tw-justify-start tw-items-center">
            {imgSrc && <img src={imgSrc} alt={address} className="tw-mr-4" />}
            <div className="tw-flex tw-flex-row tw-justify-between">
              <strong>{prettyTx(address)}</strong>
              <Button
                small
                minimal
                className="tw-ml-4 tw-text-white"
                icon="log-out"
                title={t(translations.wallet.disconnect)}
                onClick={handleDisconnect}
              />
            </div>
          </div>
        )}
        {!connected && (
          <Button
            type="button"
            text={t(translations.wallet.btn)}
            icon="log-in"
            onClick={() => handleWalletConnection()}
          />
        )}
      </div>
    </div>
  );
}
