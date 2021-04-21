/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

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
        <div className="d-flex justify-content-center align-items-center logo">
          <img alt="1" src={logo} className="text-center" />
        </div>
      </div>
      <div className="d-flex my-3 justify-content-center align-items-center text-center">
        <a onClick={props.onStart} className="titleTut font-family-montserrat">
          How to connect to RSK Mainnet with {props.walletType}
        </a>
      </div>
    </>
  );
}
