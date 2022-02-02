import { WalletContext } from '@sovryn/react-wallet';
import { isWeb3Wallet } from '@sovryn/wallet';
import React, {
  useMemo,
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
import transakSDK from '@transak/transak-sdk';

import WhiteAlert from 'assets/images/error_white.svg';
import styles from './index.module.scss';
import { useAccount } from 'app/hooks/useAccount';
import { currentChainId } from 'utils/classifiers';
import { translations } from 'locales/i18n';
import { AssetRenderer } from '../AssetRenderer';
import { Asset } from 'types/asset';
import { FiatButton } from './FiatButton';

export const TransakScreen: React.FC = () => {
  const { t } = useTranslation();
  const { connected, wallet } = useContext(WalletContext);
  const account = useAccount();
  const [open, setOpen] = useState(false);

  const isWrongChainId = useMemo(
    () =>
      connected &&
      isWeb3Wallet(wallet.providerType!) &&
      wallet.chainId !== currentChainId,
    [connected, wallet.chainId, wallet.providerType],
  );

  useEffect(() => {
    if (open && account !== '') {
      const transakSettings = {
        apiKey: process.env.REACT_APP_TRANSAK_API_KEY, // Your API Key
        environment: process.env.REACT_APP_TRANSAK_ENV, // STAGING/PRODUCTION
        defaultCryptoCurrency: 'RBTC',
        walletAddress: account, // Your customer's wallet address
        themeColor: '000000', // App theme color
        fiatCurrency: '', // INR/GBP
        email: '', // Your customer's email address
        redirectURL: '',
        hostURL: window.location.origin,
        widgetHeight: '550px',
        widgetWidth: '450px',
        disableWalletAddressForm: true,
        cryptoCurrencyCode: 'RBTC',
        cryptoCurrencyList: 'RBTC',
        hideMenu: true,
      };
      const transak = new transakSDK(transakSettings);
      transak.init();
      // This will trigger when the user marks payment is made.
      transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, orderData => {
        // transak.close();
      });
      transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
        setOpen(false);
      });
    }
  }, [account, open]);

  const handleClick = useCallback(() => setOpen(true), []);

  return (
    <>
      <h2 className={styles.title}>
        {' '}
        <Trans
          i18nKey={translations.transakDialog.title}
          components={[<AssetRenderer asset={Asset.RBTC} />]}
        />
      </h2>
      <div className={styles.alertBlock}>
        <img alt="white alert" src={WhiteAlert} />
      </div>
      <div className={styles.subexp1}>
        <Trans
          i18nKey={translations.transakDialog.explanation1}
          components={[<AssetRenderer asset={Asset.RBTC} />]}
        />
      </div>
      <div className={styles.subexp2}>
        <Trans
          i18nKey={translations.transakDialog.explanation2}
          components={[<AssetRenderer asset={Asset.RBTC} />]}
        />
      </div>

      {isWrongChainId && (
        <p className="tw-text-center">
          {t(translations.transakDialog.chainId)}
        </p>
      )}

      <div className={styles.buttons}>
        <FiatButton
          ready
          loading={false}
          disabled={isWrongChainId}
          onClick={handleClick}
        />
      </div>
    </>
  );
};
