/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import styled from 'styled-components/macro';

import error_alert from '../../../../assets/images/error_outline-24px.svg';
import liquality from '../../../../assets/wallet_icons/liquality.svg';
import metamask from '../../../../assets/wallet_icons/Metamask.svg';
import nifty from '../../../../assets/wallet_icons/nifty.svg';

import '../_networkRibbon.scss';

interface Props {
  onStart: () => void;
  walletType: string;
}
export function DetectionScreen(props: Props) {
  var logo: any = null;
  if (props.walletType === 'Metamask') {
    logo = metamask;
  } else if (props.walletType === 'Liquality') {
    logo = liquality;
  } else if (props.walletType === 'Nifty') {
    logo = nifty;
  }
  return (
    <>
      <div className="d-flex my-3 justify-content-center flex-row py-3 font-family-montserrat">
        <div className="mr-2">
          <img src={error_alert} alt="1" />
        </div>
        <div className="text-left subtitle">
          We detected that you are on Ethereum Mainnet
          <br /> Please switch to RSK Mainnet in your {props.walletType} wallet
        </div>
      </div>
      <div className="d-flex my-3 justify-content-center flex-row py-3 font-family-montserrat">
        <div className="d-flex flex-row justify-content-center align-items-center logo">
          <img alt="1" src={logo} className="text-center" />
        </div>
        {props.walletType === 'Metamask' && (
          <>
            <Details>
              <SubLeftDetails>
                {/* <SettingsTitle className="mt-5">
                  {' '}
                  RSK Mainnet Settings
                </SettingsTitle> */}

                <DetailTitle className="mt-3">Network Name:</DetailTitle>
                <DetailTitle className="mt-3">New RPC Url:</DetailTitle>
                <DetailTitle className="mt-3">Chaind Id:</DetailTitle>
                <DetailTitle className="mt-3">Symbol:</DetailTitle>
                <DetailTitle className="mt-3">Block Explorer URL:</DetailTitle>
              </SubLeftDetails>
              <SubRightDetails>
                <DetailTitle className="mt-3">RSK Mainnet</DetailTitle>
                <DetailTitle className="mt-3">
                  https://public-node.rsk.co
                </DetailTitle>
                <DetailTitle className="mt-3">30</DetailTitle>
                <DetailTitle className="mt-3">RBTC</DetailTitle>
                <DetailTitle className="mt-3">
                  https://explorer.rsk.co
                </DetailTitle>
              </SubRightDetails>
            </Details>
          </>
        )}
      </div>
      <div className="d-flex my-3 justify-content-center align-items-center text-center">
        <a onClick={props.onStart} className="titleTut font-family-montserrat">
          How to connect to RSK Mainnet with {props.walletType}
        </a>
      </div>
    </>
  );
}
const Details = styled.div`
  width: 40%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
const SubLeftDetails = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  /* justify-content: start; */
`;
const SubRightDetails = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  /* justify-content: start; */
`;
// const SettingsTitle = styled.div`
//   font-size: 15px;
//   font-weight: 500;
//   text-align: left;
//   color: white;
// `;
const DetailTitle = styled.div`
  font-size: 12px;
  font-weight: 400;
  text-align: left;
  color: white;
`;
