import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { reactLocalStorage } from 'reactjs-localstorage';
import { NavLink } from 'react-router-dom';
import {
  Button as IconButton,
  Icon,
  Menu,
  MenuItem,
  Popover,
  Spinner,
} from '@blueprintjs/core';
import styled from 'styled-components';
import { actions } from 'app/containers/TutorialDialogModal/slice';
import { useSelector, useDispatch } from 'react-redux';
import { prettyTx } from 'utils/helpers';
import { Sovryn } from 'utils/sovryn';
import { SHOW_MODAL } from 'utils/classifiers';
import { translations } from 'locales/i18n';
import { selectWalletProvider } from '../WalletProvider/selectors';
import { media } from '../../../styles/media';
import '../LendBorrowSovryn/assets/index.scss';
import { useLocation } from 'react-router-dom';

type Props = {};

const WalletConnectorContainer: React.FC<Props> = props => {
  const { connected, connecting, address } = useSelector(selectWalletProvider);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleWalletConnection = useCallback(() => {
    //don't show TutorialDialogModal if unsubscribe route
    if (location.pathname === '/unsubscribe') {
      Sovryn.connect()
        .then(() => {})
        .catch(console.error);
    } else {
      dispatch(actions.showModal(SHOW_MODAL));
      reactLocalStorage.set('closedRskTutorial', 'false');
    }
  }, [dispatch, location.pathname]);

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
              <span className="d-none d-xl-inline">
                {t(translations.wallet.connect_btn)}
              </span>
              <Icon icon="log-in" className="d-xl-none" />
            </>
          )}
        </StyledButton>
      ) : (
        <div>
          <div className="engage-wallet w-auto justify-content-center align-items-center d-none d-xl-flex mr-3">
            <span className="d-flex flex-nowrap flex-row align-items-center">
              <span>{prettyTx(address, 5, 3)}</span>
              <IconButton
                className="ml-1 icon-btn"
                title={t(translations.wallet.disconnect)}
                onClick={handleDisconnect}
                icon="log-out"
              />
            </span>
          </div>
          <StyledButton className="d-xl-none">
            <Popover
              content={
                <Menu>
                  <MenuItem icon="user" text={prettyTx(address)} />
                  <MenuItem
                    icon="log-out"
                    text={t(translations.wallet.disconnect)}
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
        className="help flex-shrink-0 flex-grow-0 d-none d-xl-flex flex-row text-decoration-none justify-content-center align-items-center"
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
  ${media.xl`
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
