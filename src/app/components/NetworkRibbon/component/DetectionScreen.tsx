import React from 'react';
import { useTranslation } from 'react-i18next';
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Icon } from '@blueprintjs/core';
import { translations } from 'locales/i18n';
import { useWalletContext } from '@sovryn/react-wallet';
import error_alert from '../../../../assets/images/error_outline-24px.svg';
import liquality from '../../../../assets/wallet_icons/liquality.svg';
import metamask from '../../../../assets/wallet_icons/Metamask.svg';
import nifty from '../../../../assets/wallet_icons/nifty.svg';
import netData from './network.json';
import { currentNetwork } from 'utils/classifiers';
import { addRskMainnet, addRskTestnet } from 'utils/metamaskHelpers';

import '../_networkRibbon.scss';
import { ActionButton } from 'app/components/Form/ActionButton';

const addNetworkCallback =
  currentNetwork === 'mainnet' ? addRskMainnet : addRskTestnet;

interface Props {
  onStart: () => void;
  walletType: string;
}

export function DetectionScreen(props: Props) {
  var logo: any = null;
  const { ethereum } = window;
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
          <div className="tw-flex tw-items-center tw-ml-12">
            <ActionButton
              text={t(translations.wrongNetworkDialog.metamask.connectButton)}
              onClick={addNetworkCallback}
              className="tw-block tw-w-full tw-h-10 tw-px-9 tw-rounded-10px tw-bg-primary tw-bg-opacity-5"
              textClassName="tw-text-lg tw-tracking-normal tw-leading-5.5 tw-font-semibold"
            />
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
