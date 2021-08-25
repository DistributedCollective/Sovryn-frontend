import { Icon, Menu, MenuItem, Popover, Spinner } from '@blueprintjs/core';
import { useWalletContext } from '@sovryn/react-wallet';
import blockies from 'ethereum-blockies';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toastSuccess } from 'utils/toaster';
import styled from 'styled-components/macro';

import { translations } from 'locales/i18n';
import { prettyTx } from 'utils/helpers';

import { media } from '../../../styles/media';

import '../../pages/BorrowPage/assets/index.scss';

type Props = {
  simpleView: boolean;
};

const WalletConnectorContainer: React.FC<Props> = props => {
  const {
    connected,
    address,
    connect,
    disconnect,
    connecting,
  } = useWalletContext();
  const { t } = useTranslation();
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
    <div className="tw-justify-center tw-items-center tw-hidden md:tw-flex">
      {!connected && !address ? (
        <StyledButton
          onClick={() => connect()}
          className="tw-flex tw-justify-center tw-items-center tw-bg-ctaHover hover:tw-opacity-75"
        >
          {connecting && <Spinner size={22} />}
          {!connecting && (
            <span className="tw-hidden xl:tw-inline tw-truncate">
              {t(translations.wallet.connect_btn)}
            </span>
          )}
        </StyledButton>
      ) : (
        <div className={simpleViewClass}>
          <Popover
            placement={'bottom'}
            content={
              address ? (
                <Menu>
                  <CopyToClipboard
                    text={address}
                    onCopy={() =>
                      toastSuccess(
                        <>{t(translations.onCopy.address)}</>,
                        'copy',
                      )
                    }
                  >
                    <MenuItem
                      icon="duplicate"
                      text={t(translations.wallet.copy_address)}
                    />
                  </CopyToClipboard>
                </Menu>
              ) : undefined
            }
          >
            <>
              <div className="engage-wallet tw-w-auto tw-justify-center tw-items-center tw-hidden xl:tw-flex tw-cursor-pointer">
                <span className="tw-flex tw-flex-nowrap tw-flex-row tw-items-center tw-w-full tw-justify-between tw-truncate">
                  <span>{prettyTx(address || '', 4, 4)}</span>
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
                    onClick={() => disconnect()}
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
