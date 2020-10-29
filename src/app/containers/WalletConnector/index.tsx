import React, { useCallback } from 'react';
import {
  Button as IconButton,
  Icon,
  Menu,
  MenuItem,
  Popover,
  Spinner,
} from '@blueprintjs/core';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';

import '../LendBorrowSovryn/assets/index.scss';
import { useSelector } from 'react-redux';
import { prettyTx } from 'utils/helpers';
import { Sovryn } from 'utils/sovryn';
import { selectWalletProvider } from '../WalletProvider/selectors';
import { media } from '../../../styles/media';
import { NavLink } from 'react-router-dom';

type Props = {};

const WalletConnectorContainer: React.FC<Props> = props => {
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
        <StyledButton
          onClick={handleWalletConnection}
          className="d-flex justify-content-center align-items-center"
        >
          {connecting && <Spinner size={22} />}
          {!connecting && (
            <>
              <span className="d-none d-lg-inline">Engage wallet</span>
              <Icon icon="log-in" className="d-lg-none" />
            </>
          )}
        </StyledButton>
      ) : (
        <div>
          <div className="engage-wallet w-auto justify-content-center align-items-center d-none d-lg-flex mr-3">
            <span className="d-flex flex-nowrap flex-row align-items-center">
              <span>{prettyTx(address, 5, 3)}</span>
              <IconButton
                className="ml-1 icon-btn"
                title="Disconnect"
                onClick={handleDisconnect}
                icon="log-out"
              />
            </span>
          </div>
          <StyledButton className="d-lg-none">
            <Popover
              content={
                <Menu>
                  <MenuItem icon="user" text={prettyTx(address)} />
                  <MenuItem
                    icon="log-out"
                    text="Disconnect"
                    onClick={handleDisconnect}
                  />
                </Menu>
              }
            >
              <Icon icon="user" />
            </Popover>
          </StyledButton>
        </div>
      )}
      <NavLink
        to="/faqs"
        className="help flex-shrink-0 flex-grow-0 d-none d-lg-flex flex-row text-decoration-none justify-content-center align-items-center"
      >
        <span>?</span>
      </NavLink>
    </div>
  );
};

export default WalletConnectorContainer;

const StyledButton = styled.button.attrs(_ => ({
  type: 'button',
}))`
  border: none;
  background: none;
  color: var(--white);
  width: 48px;
  height: 48px;
  text-align: right;
  ${media.lg`
  text-align: inherit;
  background: #171717;
  margin-right: 50px;
  width: 125px;
  height: 58px;
  padding: 2px 20px;
  border-radius: 8px;
  font-weight: 600;
  border-right: 5px solid #fff;
  border-bottom: 5px solid #fff;
  border-left: 1px solid #fff;
  border-top: 1px solid #fff;

  &:hover, &:active, &:focus {
    background: none !important;
    color: #fec006 !important;
    border-right: 5px solid #fec006;
    border-bottom: 5px solid #fec006;
    border-left: 1px solid #fec006;
    border-top: 1px solid #fec006;
  }
  `}
`;
