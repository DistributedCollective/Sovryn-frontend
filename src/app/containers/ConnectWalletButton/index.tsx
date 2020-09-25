/**
 *
 * ConnectWalletButton
 *
 */

import React, { useCallback, useEffect, useState } from 'react';
import * as blockies from 'blockies-ts';
import { useInjectSaga } from 'utils/redux-injectors';
import { connectWalletButtonSaga } from './saga';
import { Button } from '@blueprintjs/core';
import { Sovryn } from '../../../utils/sovryn';
import { useSelector } from 'react-redux';
import { selectWalletProvider } from '../WalletProvider/selectors';
import { prettyTx } from '../../../utils/helpers';

export function ConnectWalletButton() {
  useInjectSaga({ key: 'connectWalletButton', saga: connectWalletButtonSaga });

  const { connected, address } = useSelector(selectWalletProvider);
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
    <div className="d-flex flex-row justify-content-end mb-3">
      <div>
        {connected && (
          <div className="d-flex flex-row justify-content-start align-items-center">
            {imgSrc && <img src={imgSrc} alt={address} className="mr-3" />}
            <div className="d-flex flex-row justify-content-between">
              <strong>{prettyTx(address)}</strong>
              <Button
                small
                minimal
                className="ml-3 text-white"
                icon="log-out"
                title="Disconnect"
                onClick={handleDisconnect}
              />
            </div>
          </div>
        )}
        {!connected && (
          <Button
            type="button"
            text={'Connect Wallet'}
            icon="log-in"
            onClick={() => handleWalletConnection()}
          />
        )}
      </div>
    </div>
  );
}
