import React, { useCallback } from 'react';
import { Button as IconButton, Spinner } from '@blueprintjs/core';
import Button from 'react-bootstrap/Button';

import '../../assets/index.scss';
import { useSelector } from 'react-redux';
import { selectWalletProvider } from '../../../WalletProvider/selectors';
import { prettyTx } from '../../../../../utils/helpers';
import { Sovryn } from '../../../../../utils/sovryn';

type Props = {};

const WalletProviderContainer: React.FC<Props> = props => {
  const { connected, connecting, address } = useSelector(selectWalletProvider);

  const handleWalletConnection = useCallback(() => {
    Sovryn.connect()
      .then(() => {})
      .catch(console.error);
  }, []);

  const handleDisconnect = () => {
    Sovryn.disconnect().then(() => {});
  };

  return (
    <div className="d-flex flex-row">
      {!connected && !address ? (
        <Button
          onClick={handleWalletConnection}
          className="engage-wallet d-flex justify-content-center align-items-center"
        >
          {connecting && <Spinner size={22} />}
          {!connecting && <span>Engage wallet</span>}
        </Button>
      ) : (
        <div className="engage-wallet w-auto d-flex justify-content-center align-items-center">
          <span className="d-flex flex-nowrap flex-row align-items-center">
            <span>{prettyTx(address, 5, 3)}</span>
            <IconButton
              className="ml-1 icon-btn"
              title="Disconnect"
              onClick={handleDisconnect}
              icon="log-in"
            />
          </span>
        </div>
      )}
      <Button className="help flex-shrink-0 flex-grow-0">?</Button>
    </div>
  );
};

export default WalletProviderContainer;
