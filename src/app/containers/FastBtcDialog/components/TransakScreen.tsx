import { useWalletContext } from '@sovryn/react-wallet';
import { isWeb3Wallet } from '@sovryn/wallet';
import React, { Dispatch, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
import transakSDK from '@transak/transak-sdk';

import WhiteAlert from '../../../../assets/images/error_white.svg';
import { translations } from '../../../../locales/i18n';
import { Asset } from '../../../../types';
import { actions } from '../slice';
import { currentChainId } from '../../../../utils/classifiers';
import { AssetRenderer } from '../../../components/AssetRenderer';
import styles from '../index.module.scss';
import { FastBtcDialogState } from '../types';
import { FiatButton } from './FiatButton';

interface TransakScreenProps {
  state: FastBtcDialogState;
  dispatch: Dispatch<any>;
}

export function TransakScreen({ state, dispatch }: TransakScreenProps) {
  const { t } = useTranslation();
  const { connected, wallet } = useWalletContext();

  const isWrongChainId = useMemo(() => {
    return (
      connected &&
      isWeb3Wallet(wallet.providerType!) &&
      wallet.chainId !== currentChainId
    );
  }, [connected, wallet.chainId, wallet.providerType]);

  useEffect(() => {
    if (state.deposit.address !== '') {
      const transakSettings = {
        apiKey: process.env.REACT_APP_TRANSAK_API_KEY, // Your API Key
        environment: process.env.REACT_APP_TRANSAK_ENV, // STAGING/PRODUCTION
        defaultCryptoCurrency: 'BTC',
        walletAddress: state.deposit.address, // Your customer's wallet address
        themeColor: '000000', // App theme color
        fiatCurrency: '', // INR/GBP
        email: '', // Your customer's email address
        redirectURL: '',
        hostURL: window.location.origin,
        widgetHeight: '550px',
        widgetWidth: '450px',
        disableWalletAddressForm: true,
        cryptoCurrencyCode: 'BTC',
        cryptoCurrencyList: 'BTC',
        hideMenu: true,
      };
      const transak = new transakSDK(transakSettings);
      transak.init();
      // This will trigger when the user marks payment is made.
      transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, orderData => {
        transak.close();
      });
      transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
        dispatch(actions.reset());
      });
    }
  }, [dispatch, state.deposit.address]);

  return (
    <>
      <h2 className={styles.title}>
        {' '}
        <Trans
          i18nKey={translations.fastBtcDialog.fiatDialog.title}
          components={[<AssetRenderer asset={Asset.RBTC} />]}
        />
      </h2>
      <div className={styles.alertBlock}>
        <img alt="white alert" src={WhiteAlert} />
      </div>
      <div className={styles.subexp1}>
        <Trans
          i18nKey={translations.fastBtcDialog.fiatDialog.explanation1}
          components={[<AssetRenderer asset={Asset.RBTC} />]}
        />
      </div>
      <div className={styles.subexp2}>
        <Trans
          i18nKey={translations.fastBtcDialog.fiatDialog.explanation2}
          components={[<AssetRenderer asset={Asset.RBTC} />]}
        />
      </div>
      <div>
        <div className={styles.limitsTitle}>
          {t(translations.fastBtcDialog.limits.title)}
        </div>
        <div className={styles.limitsValue}>
          <div>
            •{' '}
            {t(translations.fastBtcDialog.limits.min, {
              amount: parseFloat(state.limits.min.toFixed(4)),
            })}{' '}
          </div>
          <div> {t(translations.fastBtcDialog.limits.btc)} </div>
        </div>
        <div className={styles.limitsValue}>
          <div>
            •{' '}
            {t(translations.fastBtcDialog.limits.max, {
              amount: parseFloat(state.limits.max.toFixed(4)),
            })}{' '}
          </div>
          <div>{t(translations.fastBtcDialog.limits.btc)} </div>
        </div>
      </div>

      <div>
        <div className={styles.instructionsTitle}>
          {t(translations.fastBtcDialog.instructions.title)}
        </div>
        <div className={styles.instructionsValue}>
          • {t(translations.fastBtcDialog.fiatDialog.instructions.point1)}
          <br />• {t(translations.fastBtcDialog.fiatDialog.instructions.point2)}
        </div>
      </div>

      {isWrongChainId && (
        <p className="tw-text-center">
          {t(translations.fastBtcDialog.instructions.chainId)}
        </p>
      )}

      <div className={styles.buttons}>
        <FiatButton
          loading={state.deposit.loading}
          ready={state.ready}
          disabled={isWrongChainId}
          onClick={() => {
            dispatch(actions.generateDepositAddress());
          }}
        />
      </div>
    </>
  );
}
