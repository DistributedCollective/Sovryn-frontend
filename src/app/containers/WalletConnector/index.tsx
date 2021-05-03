import {
  Icon,
  Menu,
  MenuDivider,
  MenuItem,
  Popover,
  Spinner,
} from '@blueprintjs/core';
import { useWalletContext } from '@sovryn/react-wallet';
import blockies from 'ethereum-blockies';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';

import { translations } from 'locales/i18n';
import { prettyTx } from 'utils/helpers';

import { media } from '../../../styles/media';

import '../LendBorrowSovryn/assets/index.scss';

type Props = {
  simpleView: boolean;
};

const WalletConnectorContainer: React.FC<Props> = props => {
  const {
    connected,
    loading: connecting,
    address,
    connect,
    disconnect,
  } = useWalletContext();
  const { t } = useTranslation();
  const history = useHistory();
  const simpleView = props.simpleView;
  const simpleViewClass = simpleView ? 'simpleView' : '';

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
    <div className="justify-content-center align-items-center d-none d-md-flex">
      {!connected && !address ? (
        <StyledButton
          onClick={() => connect()}
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
                <MenuDivider />
                {/*<MenuItem*/}
                {/*  icon="log-in"*/}
                {/*  text={t(translations.wallet.changeWallet)}*/}
                {/*  onClick={() => connect()}*/}
                {/*/>*/}
                <MenuItem
                  icon="log-out"
                  text={t(translations.wallet.disconnect)}
                  onClick={() => disconnect()}
                />
              </Menu>
            }
          >
            <>
              <div className="engage-wallet w-auto justify-content-center align-items-center d-none d-xl-flex cursor-pointer">
                <span className="d-flex flex-nowrap flex-row align-items-center w-100 justify-content-between">
                  <span>{prettyTx(address, 4, 4)}</span>
                  <span className="pl-2">
                    <img
                      className="rounded-circle"
                      src={getWalletAddrBlockieImg()}
                      alt="wallet address"
                    />
                  </span>
                  <Icon
                    icon="log-out"
                    className="logout"
                    onClick={() => disconnect()}
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
