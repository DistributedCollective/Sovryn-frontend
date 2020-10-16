import React, { useCallback, useEffect, useState } from 'react';
import { Button as IconButton } from '@blueprintjs/core';
import Button from 'react-bootstrap/Button';

import '../../assets/index.scss';
import * as blockies from 'blockies-ts';
import { useSelector } from 'react-redux';
import { selectWalletProvider } from '../../../WalletProvider/selectors';
import { prettyTx } from '../../../../../utils/helpers';
import { Sovryn } from '../../../../../utils/sovryn';
import { useHistory } from 'react-router-dom';

type Props = {};

const WalletProviderContainer: React.FC<Props> = props => {
  const history = useHistory();
  const [imgSrc, setImgSrc] = useState<string>(null as any);
  const { connected, address } = useSelector(selectWalletProvider);

  const handleWalletConnection = useCallback(() => {
    Sovryn.connect()
      .then(() => {})
      .catch(console.error);
  }, []);

  const handleDisconnect = () => {
    Sovryn.disconnect().then(() => {
      history.push('/');
    });
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
    <>
      {!connected && !address ? (
        <div>
          <Button onClick={handleWalletConnection} className="engage-wallet">
            Engage wallet
          </Button>
          <Button className="help">?</Button>
        </div>
      ) : (
        <div className="d-flex flex-row justify-content-start align-items-center">
          {imgSrc && <img src={imgSrc} alt={address} className="mr-3" />}
          <div className="d-flex flex-row justify-content-between align-items-center">
            <strong>{prettyTx(address)}</strong>
            <IconButton
              className="ml-3 icon-btn"
              title="Disconnect"
              onClick={handleDisconnect}
              icon="log-in"
            />
          </div>
          <Button className="help">?</Button>
        </div>
      )}
    </>
  );
};

export default WalletProviderContainer;
