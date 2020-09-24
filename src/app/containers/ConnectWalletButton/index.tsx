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

interface Props {}

export function ConnectWalletButton(props: Props) {
  useInjectSaga({ key: 'connectWalletButton', saga: connectWalletButtonSaga });

  const { connected, address } = useSelector(selectWalletProvider);
  const [imgSrc, setImgSrc] = useState<string>(null as any);

  const handleWalletConnection = useCallback(() => {
    console.log('connect clicked', Sovryn);
    Sovryn.connect()
      .then(e => console.log(e))
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
            <div>
              <div>
                <strong>{prettyTx(address)}</strong>
              </div>
              <div className="text-right">
                <Button
                  small
                  minimal
                  className="text-white"
                  icon="log-out"
                  text="Disconnect"
                  onClick={handleDisconnect}
                />
              </div>
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
