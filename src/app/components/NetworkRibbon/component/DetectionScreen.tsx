import React from 'react';
import { useTranslation } from 'react-i18next';
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
import { ActionButton } from 'app/components/Form/ActionButton';

import styles from '../NetworkRibbon.module.scss';

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
  const chainId = parseInt(ethereum?.chainId as string);
  const walletName =
    props.walletType.charAt(0).toUpperCase() + props.walletType.slice(1);
  const netName = netData.find(item => item.chainId === chainId)?.chain;
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
      <div className="tw-flex tw-my-4 tw-pt-4 sm:tw-pb-12 tw-justify-center tw-flex-row  tw-font-body">
        <div className="tw-mr-2">
          <img src={error_alert} alt="1" />
        </div>
        <div className="tw-w-full tw-max-w-5/12 tw-text-warning tw-font-normal tw-text-sm tw-leading-snug tw-normal-case tw-text-left">
          {netName
            ? t(translations.wrongNetworkDialog.networkAlert, {
                name: netName,
              })
            : t(translations.wrongNetworkDialog.networkAlertUnknown)}
          <br />
          {t(translations.wrongNetworkDialog.walletAelrt, {
            string: walletName,
          })}
        </div>
      </div>
      <div className="tw-flex tw-mx-4 tw-mb-8 md:tw-mb-12 xl:tw-mb-24 tw-justify-center tw-flex-col sm:tw-flex-row tw-font-body">
        <div className="tw-flex tw-flex-row tw-justify-center tw-items-center logo">
          <img alt="1" src={logo} className="tw-text-center" />
        </div>
        {props.walletType === 'metamask' && (
          <div className="tw-flex tw-items-center tw-mt-4 sm:tw-mt-0 sm:tw-ml-12">
            <ActionButton
              text={t(translations.wrongNetworkDialog.metamask.connectButton)}
              onClick={addNetworkCallback}
              className="tw-block tw-w-full tw-px-9 tw-rounded-lg tw-bg-gray-1 tw-bg-opacity-10"
              textClassName="tw-text-lg tw-tracking-normal tw-leading-6 tw-font-semibold"
              data-action-id="connect-metamask-button"
            />
          </div>
        )}
      </div>
      <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-text-center">
        <button onClick={props.onStart} className={styles.linkButton}>
          {t(translations.wrongNetworkDialog.tutorialGuide, {
            wallet: walletName,
          })}{' '}
        </button>
        <button className={styles.linkButton} onClick={() => disconnect()}>
          <Icon
            icon="log-out"
            className="tw-text-primary tw-mr-1"
            iconSize={12}
          />{' '}
          {t(translations.wallet.disconnect)}
        </button>
      </div>
    </>
  );
}
