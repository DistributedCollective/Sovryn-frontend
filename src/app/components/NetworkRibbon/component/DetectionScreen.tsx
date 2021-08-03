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

import styles from '../NetworkRibbon.module.scss';
import { ActionButton } from 'app/components/Form/ActionButton';
import classNames from 'classnames';

const addNetworkCallback =
  currentNetwork === 'mainnet' ? addRskMainnet : addRskTestnet;

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
      <div className="tw-flex tw-my-4 tw-justify-center tw-flex-row tw-pt-4 tw-pb-12 tw-font-body">
        <div className="tw-mr-2">
          <img src={error_alert} alt="1" />
        </div>
        <div className={classNames(styles.subtitle, 'tw-text-left')}>
          {t(translations.wrongNetworkDialog.networkAlert, {
            name: netName,
          })}
          <br />
          {t(translations.wrongNetworkDialog.walletAelrt, {
            string: walletName,
          })}
        </div>
      </div>
      <div className="tw-flex tw-mt-4 tw-mb-12 tw-justify-center tw-flex-row tw-pb-12 tw-font-body">
        <div className="tw-flex tw-flex-row tw-justify-center tw-items-center logo">
          <img alt="1" src={logo} className="tw-text-center" />
        </div>
        {props.walletType === 'metamask' && (
          <div className="tw-flex tw-items-center tw-ml-12">
            <ActionButton
              text={t(translations.wrongNetworkDialog.metamask.connectButton)}
              onClick={addNetworkCallback}
              className="tw-block tw-w-full tw-h-10 tw-px-9 tw-rounded-lg tw-bg-primary tw-bg-opacity-5"
              textClassName="tw-text-lg tw-tracking-normal tw-leading-6 tw-font-semibold"
            />
          </div>
        )}
      </div>
      <div className="tw-flex tw-my-12 tw-flex-col tw-justify-center tw-items-center tw-text-center">
        <a
          onClick={props.onStart}
          className={classNames(styles.titleTut, 'tw-font-body tw-mb-4')}
        >
          {t(translations.wrongNetworkDialog.tutorialGuide, {
            wallet: walletName,
          })}{' '}
        </a>
        <a
          className={classNames(
            styles.titleTut,
            'tw-flex tw-items-center tw-justify-center tw-font-body',
          )}
          onClick={() => disconnect()}
        >
          <Icon icon="log-out" className="tw-text-gold tw-mr-1" iconSize={12} />{' '}
          {t(translations.wallet.disconnect)}
        </a>
      </div>
    </>
  );
}
