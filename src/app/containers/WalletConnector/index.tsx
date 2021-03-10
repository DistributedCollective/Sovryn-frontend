import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { reactLocalStorage } from 'reactjs-localstorage';
import { Icon, Menu, MenuItem, Popover, Spinner } from '@blueprintjs/core';
import blockies from 'ethereum-blockies';
import styled from 'styled-components/macro';
import { actions } from 'app/containers/EngageWalletDialog/slice';
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
    //don't show EngageWalletDialog if unsubscribe route
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

  const getWalletAddrBlockieImg = (): string => {
    return blockies
      .create({
        // All options are optional
        seed: address, // seed used to generate icon data, default: random
        color: '#dfe', // to manually specify the icon color, default: random
        bgcolor: '#aaa', // choose a different background color, default: random
        size: 8, // width/height of the icon in blocks, default: 8
        scale: 3, // width/height of each block in pixels, default: 4
        spotcolor: '#000', // each pixel has a 13% chance of being of a third color,
      })
      .toDataURL();
  };

  return (
    <div className="tw-justify-center tw-items-center tw-hidden md:tw-flex">
      {!connected && !address ? (
        <StyledButton
          onClick={handleWalletConnection}
          className="tw-flex tw-justify-center tw-items-center"
        >
          {connecting && <Spinner size={22} />}
          {!connecting && (
            <>
              <span className="tw-hidden xl:tw-inline">
                {t(translations.wallet.connect_btn)}
              </span>
              <Icon icon="log-in" className="xl:tw-hidden" />
            </>
          )}
        </StyledButton>
      ) : (
        <div className={simpleViewClass}>
          <Popover
            content={
              <Menu>
                <MenuItem
                  icon="briefcase"
                  text={t(translations.wallet.my_wallet)}
                  onClick={() => history.push('/wallet')}
                />
                <MenuItem
                  icon="people"
                  text={t(translations.wallet.referrals)}
                  onClick={() => history.push('/referral')}
                />
              </Menu>
            }
          >
            <>
              <div className="engage-wallet tw-w-auto tw-justify-center tw-items-center tw-hidden xl:tw-flex tw-cursor-pointer">
                <span className="tw-flex tw-flex-nowrap tw-flex-row tw-items-center tw-w-full tw-justify-between">
                  <span>{prettyTx(address, 4, 4)}</span>
                  <span className="tw-pl-2">
                    <img
                      className="tw-rounded"
                      src={getWalletAddrBlockieImg()}
                      alt="wallet address"
                    />
                  </span>
                  <Icon
                    icon="log-out"
                    className="logout"
                    onClick={handleDisconnect}
                  />
                </span>
              </div>
              <StyledButton className="xl:tw-hidden">
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
