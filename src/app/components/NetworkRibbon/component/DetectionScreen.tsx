import React from 'react';
import { useTranslation } from 'react-i18next';
/* eslint-disable jsx-a11y/anchor-is-valid */
import styled from 'styled-components/macro';
import { Icon } from '@blueprintjs/core';
import { translations } from 'locales/i18n';
import { useWalletContext } from '@sovryn/react-wallet';
import error_alert from '../../../../assets/images/error_outline-24px.svg';
import liquality from '../../../../assets/wallet_icons/liquality.svg';
import metamask from '../../../../assets/wallet_icons/Metamask.svg';
import nifty from '../../../../assets/wallet_icons/nifty.svg';
import netData from './network.json';
import { addRskMainnet } from 'utils/metamaskHelpers';

import '../_networkRibbon.scss';

interface Props {
  onStart: () => void;
  walletType: string;
}

export function DetectionScreen(props: Props) {
  var logo: any = null;
  const { ethereum } = window as any;
  const { t } = useTranslation();
  const chainId = parseInt(ethereum.chainId as string);
  const walletName =
    props.walletType.charAt(0).toUpperCase() + props.walletType.slice(1);
  // eslint-disable-next-line array-callback-return
  const netName = netData.find(item => item.chainId === chainId)?.chain || 0;
  if (props.walletType === 'metamask') {
    logo = metamask;
  } else if (props.walletType === 'liquality') {
    logo = liquality;
  } else if (props.walletType === 'nifty') {
    logo = nifty;
  }
  const { disconnect } = useWalletContext();
  return (
    <>
      <div className="d-flex my-3 justify-content-center flex-row pt-3 pb-5 font-family-montserrat">
        <div className="mr-2">
          <img src={error_alert} alt="1" />
        </div>
        <div className="text-left subtitle">
          {t(translations.wrongNetworkDialog.networkAlert, {
            name: netName,
          })}
          <br />
          {t(translations.wrongNetworkDialog.walletAelrt, {
            string: walletName,
          })}
        </div>
      </div>
      <div className="d-flex mt-3 mb-5 justify-content-center flex-row pb-5 font-family-montserrat">
        <div className="d-flex flex-row justify-content-center align-items-center logo">
          <img alt="1" src={logo} className="text-center" />
        </div>
        {props.walletType === 'metamask' && (
          <div className="d-flex flex-column ml-5">
            <SettingsTitle>
              {' '}
              {t(translations.wrongNetworkDialog.networkSetting.title)}
            </SettingsTitle>

            <Details>
              <SubLeftDetails>
                <DetailTitle>
                  {t(
                    translations.wrongNetworkDialog.networkSetting.networkName,
                  )}
                  :
                </DetailTitle>
                <DetailTitle>
                  {t(translations.wrongNetworkDialog.networkSetting.rpcUrl)}:
                </DetailTitle>
                <DetailTitle>
                  {t(translations.wrongNetworkDialog.networkSetting.chainId)}:
                </DetailTitle>
                <DetailTitle>
                  {t(translations.wrongNetworkDialog.networkSetting.symbol)}:
                </DetailTitle>
                <DetailTitle>
                  {t(
                    translations.wrongNetworkDialog.networkSetting.explorerUrl,
                  )}
                  :
                </DetailTitle>
              </SubLeftDetails>
              <SubRightDetails>
                <DetailTitle>RSK Mainnet</DetailTitle>
                <DetailTitle>https://public-node.rsk.co</DetailTitle>
                <DetailTitle>30</DetailTitle>
                <DetailTitle>RBTC</DetailTitle>
                <DetailTitle>https://explorer.rsk.co</DetailTitle>
              </SubRightDetails>
            </Details>
            <button
              onClick={addRskMainnet}
              style={{ border: '1px solid white' }}
            >
              Or click here to setup the RSK Mainnet
            </button>
          </div>
        )}
      </div>
      <div className="d-flex my-5 flex-column justify-content-center align-items-center text-center">
        <a
          onClick={props.onStart}
          className="titleTut font-family-montserrat mb-3"
        >
          {t(translations.wrongNetworkDialog.tutorialGuide, {
            wallet: walletName,
          })}{' '}
        </a>
        <a
          className="d-flex align-items-center justify-content-center titleTut font-family-montserrat"
          onClick={() => disconnect()}
        >
          <Icon icon="log-out" className="tw-text-gold mr-1" iconSize={12} />{' '}
          {t(translations.wallet.disconnect)}
        </a>
      </div>
    </>
  );
}
const Details = styled.div`
  width: 120%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
const SubLeftDetails = styled.div`
  width: 50%;
  display: flex;
  height: 160px;
  justify-content: space-evenly;
  flex-direction: column;
  /* justify-content: start; */
`;
const SubRightDetails = styled.div`
  width: 60%;
  display: flex;
  height: 160px;
  justify-content: space-evenly;
  flex-direction: column;
  /* justify-content: start; */
`;
const SettingsTitle = styled.div`
  font-size: 15px;
  font-weight: 500;
  text-align: left;
  color: white;
`;
const DetailTitle = styled.div`
  font-size: 12px;
  font-weight: 400;
  text-align: left;
  color: white;
`;
