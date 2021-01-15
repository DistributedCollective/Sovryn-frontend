import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { reactLocalStorage } from 'reactjs-localstorage';
import {
  Icon,
  Menu,
  MenuDivider,
  MenuItem,
  Popover,
  Spinner,
} from '@blueprintjs/core';
import styled from 'styled-components/macro';
import { actions } from 'app/containers/TutorialDialogModal/slice';
import { useSelector, useDispatch } from 'react-redux';
import { prettyTx } from 'utils/helpers';
import { Sovryn } from 'utils/sovryn';
import { SHOW_MODAL } from 'utils/classifiers';
import { translations } from 'locales/i18n';
import { selectWalletProvider } from '../WalletProvider/selectors';
import { media } from '../../../styles/media';
import { useHistory, useLocation } from 'react-router-dom';
import '../LendBorrowSovryn/assets/index.scss';

type Props = {
  simpleView: boolean;
};

const WalletConnectorContainer: React.FC<Props> = props => {
  const { connected, connecting, address } = useSelector(selectWalletProvider);
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const simpleView = props.simpleView;
  const simpleViewClass = simpleView ? 'simpleView' : '';

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
    <div className="justify-content-center align-items-center d-none d-md-flex">
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
        <div className={simpleViewClass}>
          <Popover
            content={
              <Menu>
                <MenuItem icon="user" text={prettyTx(address)} />
                <MenuDivider />
                <MenuItem
                  icon="briefcase"
                  text={t(translations.wallet.my_wallet)}
                  onClick={() => history.push('/wallet')}
                />
                <MenuItem
                  icon="people"
                  text={t(translations.wallet.referrals)}
                  onClick={() => history.push('/referrals')}
                />
              </Menu>
            }
          >
            <>
              <div className="engage-wallet w-auto justify-content-center align-items-center d-none d-xl-flex">
                <span className="d-flex flex-nowrap flex-row align-items-center">
                  <span>{prettyTx(address, 4, 4)}</span>
                  {!simpleView && (
                    <Icon
                      icon="full-circle"
                      iconSize={20}
                      color="#4ECDC4"
                      className="ml-2 is-pointer"
                    />
                  )}
                  <Icon
                    icon="log-out"
                    className="logout"
                    onClick={handleDisconnect}
                  />
                </span>
              </div>
              <StyledButton className="d-xl-none">
                <Icon icon="user" />
              </StyledButton>
            </>
          </Popover>
        </div>
      )}
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
  text-align: center;
  ${media.xl`
    border: 1px solid;
    white-space: nowrap;
    width: auto;
    margin: 0;
    height: 40px;
    padding: 5px 26px;
    font-weight: 100;
    color: #FEC004;
    font-size: 18px;
    font-family: 'Montserrat';
    letter-spacing: -1px;
    text-transform: capitalize;
    transition: all .3s;
    border-radius: 10px;
    &:hover {
      background: rgba(254,192,4, 0.25) !important;
    }
    &:active, &:focus {
      background: rgba(254,192,4, 0.5) !important;
    }
  `}
`;
